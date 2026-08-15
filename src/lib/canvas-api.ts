/**
 * Canvas LMS API Client
 *
 * Fetches course data from Canvas for display on the website.
 * All content comes from Canvas as the single source of truth.
 */

// Read env vars at call time (not module load time) for flexibility
function getConfig() {
  return {
    baseUrl: process.env.CANVAS_BASE_URL || '',
    token: process.env.CANVAS_API_TOKEN || '',
  };
}

// Types for Canvas API responses
export interface CanvasTerm {
  id: number;
  name: string;
  start_at: string | null;
  end_at: string | null;
}

export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  workflow_state: string;
  term?: CanvasTerm;
  syllabus_body?: string;
}

export interface CanvasPage {
  page_id: number;
  url: string;
  title: string;
  body: string;
  published: boolean;
  front_page: boolean;
  updated_at: string;
}

export interface CanvasPageSummary {
  page_id: number;
  url: string;
  title: string;
  published: boolean;
  front_page: boolean;
  updated_at: string;
}

class CanvasAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'CanvasAPIError';
  }
}

/** Canvas throttles with 403 plus a rate-limit body, not only with 429. */
async function isThrottled(response: Response): Promise<boolean> {
  if (response.status === 429) return true;
  if (response.status !== 403) return false;
  const body = await response.clone().text().catch(() => '');
  return /rate limit/i.test(body);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * One authenticated request to Canvas, with a timeout and rate-limit retry.
 *
 * Returns the Response rather than parsed JSON so callers can read the `Link`
 * header, which is what pagination depends on.
 */
async function canvasRequest(url: string, endpoint: string, attempts = 4): Promise<Response> {
  const { token } = getConfig();

  for (let attempt = 0; attempt < attempts; attempt++) {
    // Fresh controller per attempt: an aborted signal cannot be reused.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        signal: controller.signal,
        next: { revalidate: 86400 }, // ISR: revalidate every 24 hours
      });

      clearTimeout(timeoutId);

      if (response.ok) return response;

      if (await isThrottled(response) && attempt < attempts - 1) {
        await sleep(2 ** attempt * 1000);
        continue;
      }

      throw new CanvasAPIError(
        `Canvas API error: ${response.status} ${response.statusText}`,
        response.status,
        endpoint
      );
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Canvas API request timed out: ${endpoint}`);
      }
      throw error;
    }
  }

  throw new CanvasAPIError(`Canvas API error: gave up after ${attempts} attempts`, 429, endpoint);
}

/**
 * Make an authenticated request to Canvas API. For single objects.
 *
 * Does not paginate — use `canvasFetchAll` for collections.
 */
async function canvasFetch<T>(endpoint: string): Promise<T> {
  const { baseUrl, token } = getConfig();

  if (!baseUrl || !token) {
    console.error('Canvas API credentials not configured');
    throw new Error('Canvas API credentials not configured. Set CANVAS_BASE_URL and CANVAS_API_TOKEN.');
  }

  const response = await canvasRequest(`${baseUrl}${endpoint}`, endpoint);
  return response.json();
}

/** Extract the `rel="next"` URL from a Link header. */
function nextLink(header: string | null): string | null {
  if (!header) return null;
  for (const part of header.split(',')) {
    const match = part.match(/<([^>]*)>\s*;\s*rel="next"/);
    if (match) return match[1];
  }
  return null;
}

/**
 * Fetch every page of a collection by following `Link: rel="next"`.
 *
 * `per_page=100` alone is not enough: Canvas caps the page size and silently
 * returns only the first page, so a course with more pages than the cap loses
 * the remainder with no error. Two of the courses here exceed it — one has 194
 * pages. Numeric `page=N` params are not a substitute; some endpoints paginate
 * with bookmark cursors, and the Link header is the only reliable method.
 */
async function canvasFetchAll<T>(endpoint: string): Promise<T[]> {
  const { baseUrl, token } = getConfig();

  if (!baseUrl || !token) {
    console.error('Canvas API credentials not configured');
    throw new Error('Canvas API credentials not configured. Set CANVAS_BASE_URL and CANVAS_API_TOKEN.');
  }

  const separator = endpoint.includes('?') ? '&' : '?';
  let url: string | null = `${baseUrl}${endpoint}${separator}per_page=100`;

  const items: T[] = [];
  while (url) {
    const response = await canvasRequest(url, endpoint);
    items.push(...(await response.json() as T[]));
    url = nextLink(response.headers.get('link'));
  }

  return items;
}

/**
 * Get all courses where user is a teacher
 */
export async function getTeacherCourses(): Promise<CanvasCourse[]> {
  const courses = await canvasFetchAll<CanvasCourse>(
    '/api/v1/courses?enrollment_type=teacher&state[]=available&include[]=term'
  );

  return courses.filter(c => c.workflow_state === 'available');
}

/**
 * Get a single course with syllabus
 */
export async function getCourse(courseId: number): Promise<CanvasCourse> {
  return canvasFetch<CanvasCourse>(
    `/api/v1/courses/${courseId}?include[]=syllabus_body&include[]=term`
  );
}

/**
 * Get all published pages for a course
 */
export async function getCoursePages(courseId: number): Promise<CanvasPageSummary[]> {
  const pages = await canvasFetchAll<CanvasPageSummary>(
    `/api/v1/courses/${courseId}/pages`
  );

  return pages.filter(p => p.published);
}

/**
 * Get a single page by URL slug
 */
export async function getCoursePage(courseId: number, pageUrl: string): Promise<CanvasPage> {
  return canvasFetch<CanvasPage>(
    `/api/v1/courses/${courseId}/pages/${pageUrl}`
  );
}

/**
 * Get the front page of a course
 */
export async function getFrontPage(courseId: number): Promise<CanvasPage | null> {
  try {
    return await canvasFetch<CanvasPage>(
      `/api/v1/courses/${courseId}/front_page`
    );
  } catch (error) {
    if (error instanceof CanvasAPIError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Strip document-level styling out of Canvas HTML before it is injected.
 *
 * Canvas embeds the account's DesignPlus stylesheet directly in page bodies:
 *
 *     <link rel="stylesheet" href="…/dp_app.css">
 *
 * Injected with dangerouslySetInnerHTML that is not scoped to the content —
 * the browser applies it to the whole document. On this site it overrode the
 * layout badly enough that the header link rendered invisible and the page
 * collapsed into a narrow column.
 *
 * Element-level `style=""` attributes are kept: those are scoped, and they
 * carry the formatting the page was actually authored with. Only things that
 * can reach outside the content area are removed.
 *
 * (canvaskit.py strips the same stylesheet for its content comparison, for a
 * different reason — Canvas injects it on ingest, so it defeats diffing.)
 */
export function sanitizeCanvasHtml(html: string): string {
  return html
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    // React will not execute these, but they should not travel with the
    // content either.
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<script\b[^>]*\/>/gi, '');
}

export interface LinkRewriteContext {
  /** Canvas id of the course whose content this is. */
  courseId: number;
  termSlug: string;
  courseSlug: string;
  /** Slugs of pages this site actually serves for the course. */
  publishedSlugs: Set<string>;
}

/**
 * Point Canvas page links at the mirror instead of at Canvas.
 *
 * Calendar pages are mostly links to other pages — day notes, completed
 * notes, review material. Canvas rewrites those to absolute URLs on its own
 * host, so following one from this site lands on a Canvas login wall: fine
 * for an enrolled student, a dead end for everyone else. Since the site
 * already serves every published page, those links can simply point here.
 *
 * Deliberately narrow. Only `/courses/<id>/pages/<slug>` links are rewritten,
 * only when the id matches the course being viewed, and only when the target
 * page is one this site actually serves. Assignments, quizzes, discussions
 * and files stay on Canvas: they are things a student *does* rather than
 * content that was mirrored, and there is nothing here to point them at —
 * redirecting those would turn a login prompt into a 404.
 */
export function rewriteCanvasLinks(html: string, ctx: LinkRewriteContext): string {
  const pattern = new RegExp(
    `https?://[a-z0-9.-]+\\.instructure\\.com/courses/(\\d+)/pages/([^"'#?\\s]+)`,
    'gi'
  );

  return html.replace(pattern, (match, id: string, slug: string) => {
    if (Number(id) !== ctx.courseId) return match;
    const decoded = decodeURIComponent(slug).toLowerCase();
    if (!ctx.publishedSlugs.has(decoded)) return match;
    return `/courses/${ctx.termSlug}/${ctx.courseSlug}/${decoded}`;
  });
}

/** Seasons that can appear in a term name or a page title. */
const SEASONS = ['spring', 'summer', 'fall', 'winter'] as const;

export function seasonOf(text: string): string | null {
  const lower = text.toLowerCase();
  return SEASONS.find(s => new RegExp(`\\b${s}\\b`).test(lower)) ?? null;
}

/**
 * Find the "Notes and Assignments" page for a course.
 *
 * Courses are copied forward between terms, so a summer shell can still carry
 * the previous spring's calendar page alongside the new one. Matching purely
 * on name priority picked the stale page — "Notes and Assignments Page 16
 * weeks Spring" outranked "Course Calendar" in a Summer course.
 *
 * So: collect every candidate, drop any whose title names a different season
 * than the course's own term, then rank by name priority and prefer the most
 * recently updated page within a tier.
 */
export async function getNotesAndAssignmentsPage(
  courseId: number,
  termName?: string
): Promise<CanvasPage | null> {
  const pages = await getCoursePages(courseId);

  // Priority order: most specific first. Naming has drifted every year or so,
  // and an unrecognised name means the course falls back to its front page —
  // which is how Fall 2026 ended up showing a homepage instead of a calendar.
  const patterns = [
    /notes\s*(and|&)\s*assignments/i,       // Current naming: "Notes and Assignments"
    /calendar\s*(and|&)\s*daily\s*notes/i,  // Fall 2024 naming: "Calendar and Daily Notes"
    /daily\s*notes\s*(and|&)\s*calendar/i,  // Alternate ordering
    /course\s*calendar/i,
    /weekly\s*learning\s*portal/i,          // Fall 2026 naming
    /learning\s*(hub|portal)/i,             // Related variants
    /schedule/i,
  ];

  const courseSeason = termName ? seasonOf(termName) : null;

  const candidates = pages
    .map(page => ({
      page,
      tier: patterns.findIndex(pattern => pattern.test(page.title)),
    }))
    .filter(c => c.tier !== -1)
    .filter(({ page }) => {
      // Keep pages that name no season, or the course's own season. A page
      // naming a different season is left over from the source course.
      if (!courseSeason) return true;
      const pageSeason = seasonOf(page.title);
      return pageSeason === null || pageSeason === courseSeason;
    })
    .sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return Date.parse(b.page.updated_at) - Date.parse(a.page.updated_at);
    });

  if (candidates.length > 0) {
    return getCoursePage(courseId, candidates[0].page.url);
  }

  // Fallback to front page
  return getFrontPage(courseId);
}

/**
 * Get pages that look like daily lecture notes (Day 1, Day 2, etc.)
 */
export async function getDayPages(courseId: number): Promise<CanvasPageSummary[]> {
  const pages = await getCoursePages(courseId);

  return pages
    .filter(p => /^day\s*\d+/i.test(p.title))
    .sort((a, b) => {
      const numA = parseInt(a.title.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.title.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });
}

/**
 * Parsed office hours data
 */
export interface ParsedOfficeHours {
  schedule: Array<{
    day: string;
    times: Array<{
      start: string;
      end: string;
      type: 'in-person' | 'virtual';
    }>;
  }>;
  room: string | null;
  zoomLink: string | null;
  additionalNotes: string[];
}

/**
 * Parse time range like "9-10am" or "12:30-1pm" into start/end
 */
export function parseTimeRange(timeStr: string): { start: string; end: string } | null {
  // Handle formats like "9-10am", "12:30-1pm", "11:30-1pm"
  const match = timeStr.match(/(\d{1,2}(?::\d{2})?)\s*-\s*(\d{1,2}(?::\d{2})?)\s*(am|pm)/i);
  if (!match) return null;

  let [, startTime, endTime, period] = match;
  period = period.toLowerCase();

  // Add :00 if no minutes specified
  if (!startTime.includes(':')) startTime += ':00';
  if (!endTime.includes(':')) endTime += ':00';

  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = parseInt(endTime.split(':')[0]);

  let startPeriod = period;

  // Logic for determining start time AM/PM:
  // - If end period is PM and start hour is 12, start is also PM (noon)
  // - If end period is PM and start hour > end hour and start hour >= 10 (but not 12), start is AM
  // - Otherwise, start period matches end period
  if (period === 'pm') {
    if (startHour === 12) {
      startPeriod = 'pm'; // 12:30-1pm means noon to 1pm
    } else if (startHour > endHour && startHour >= 10) {
      startPeriod = 'am'; // 11:30-1pm means 11:30am to 1pm
    }
  }

  return {
    start: `${startTime} ${startPeriod.toUpperCase()}`,
    end: `${endTime} ${period.toUpperCase()}`,
  };
}

/**
 * Normalize day names
 */
export function normalizeDay(day: string): string {
  const dayMap: Record<string, string> = {
    'mon': 'Monday',
    'tue': 'Tuesday',
    'tues': 'Tuesday',
    'wed': 'Wednesday',
    'thu': 'Thursday',
    'thurs': 'Thursday',
    'fri': 'Friday',
    'sat': 'Saturday',
    'sun': 'Sunday',
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday',
  };
  return dayMap[day.toLowerCase()] || day;
}

/**
 * Parse a schedule line like "Tuesday 9-10am; Wed 10-11:30am"
 */
export function parseScheduleLine(
  line: string,
  type: 'in-person' | 'virtual'
): Array<{ day: string; start: string; end: string; type: 'in-person' | 'virtual' }> {
  const results: Array<{ day: string; start: string; end: string; type: 'in-person' | 'virtual' }> = [];

  // Split by semicolon or ampersand for multiple slots
  const parts = line.split(/[;&]/);

  let lastDay = '';

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Try to match "Day Time" format (e.g., "Tuesday 9-10am")
    const dayTimeMatch = trimmed.match(/([A-Za-z]+)\s+(\d{1,2}(?::\d{2})?\s*-\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);

    if (dayTimeMatch) {
      const day = normalizeDay(dayTimeMatch[1]);
      const timeRange = parseTimeRange(dayTimeMatch[2]);

      if (timeRange) {
        lastDay = day;
        results.push({
          day,
          start: timeRange.start,
          end: timeRange.end,
          type,
        });
      }
    } else {
      // Try time-only format (e.g., "3:15-3:45pm") - uses last day
      const timeOnlyMatch = trimmed.match(/(\d{1,2}(?::\d{2})?\s*-\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);

      if (timeOnlyMatch && lastDay) {
        const timeRange = parseTimeRange(timeOnlyMatch[1]);

        if (timeRange) {
          results.push({
            day: lastDay,
            start: timeRange.start,
            end: timeRange.end,
            type,
          });
        }
      }
    }
  }

  return results;
}

/**
 * Extract and parse office hours from a course's front page
 */
export async function getOfficeHours(courseId: number): Promise<ParsedOfficeHours | null> {
  try {
    const frontPage = await getFrontPage(courseId);
    if (!frontPage) return null;

    const html = frontPage.body;
    const result: ParsedOfficeHours = {
      schedule: [],
      room: null,
      zoomLink: null,
      additionalNotes: [],
    };

    // Extract room from "Office: Room C162" or "In Person C162"
    const roomMatch = html.match(/(?:Office|In\s*Person)[:\s]*(?:Room\s*)?([A-Z]\d+)/i);
    if (roomMatch) {
      result.room = roomMatch[1];
    }

    // Extract Zoom link
    const zoomMatch = html.match(/href="(https:\/\/[^"]*zoom[^"]*)"/i);
    if (zoomMatch) {
      result.zoomLink = zoomMatch[1];
    }

    // Build a map of day -> times
    const dayScheduleMap = new Map<string, Array<{ start: string; end: string; type: 'in-person' | 'virtual' }>>();

    // Strip HTML tags for easier parsing
    const textContent = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');

    // Parse Zoom/virtual hours: "Zoom: Tuesday 9-10am; Wed 10-11:30am"
    const zoomLineMatch = textContent.match(/Zoom\s*:\s*([^🏢]+?(?:am|pm)(?:[^🏢]*?(?:am|pm))*)/i);
    if (zoomLineMatch) {
      const virtualSlots = parseScheduleLine(zoomLineMatch[1], 'virtual');
      for (const slot of virtualSlots) {
        if (!dayScheduleMap.has(slot.day)) {
          dayScheduleMap.set(slot.day, []);
        }
        dayScheduleMap.get(slot.day)!.push({ start: slot.start, end: slot.end, type: slot.type });
      }
    }

    // Parse in-person hours: "In Person C162: Tuesday 11:30-1pm; Thursday 12:30-1pm"
    const inPersonMatch = textContent.match(/In\s*Person[^:]*:\s*([^🎥💻]+?(?:am|pm)(?:[^🎥💻]*?(?:am|pm))*)/i);
    if (inPersonMatch) {
      const inPersonSlots = parseScheduleLine(inPersonMatch[1], 'in-person');
      for (const slot of inPersonSlots) {
        if (!dayScheduleMap.has(slot.day)) {
          dayScheduleMap.set(slot.day, []);
        }
        dayScheduleMap.get(slot.day)!.push({ start: slot.start, end: slot.end, type: slot.type });
      }
    }

    // Convert map to array sorted by day of week
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    result.schedule = dayOrder
      .filter(day => dayScheduleMap.has(day))
      .map(day => ({
        day,
        times: dayScheduleMap.get(day)!,
      }));

    // Extract additional notes
    const emailNoteMatch = html.match(/(?:Please\s+)?email\s+for\s+(?:additional|different)[^<.]*/i);
    if (emailNoteMatch) {
      result.additionalNotes.push(emailNoteMatch[0].trim());
    }

    return result;
  } catch (error) {
    console.error('Error parsing office hours:', error);
    return null;
  }
}
