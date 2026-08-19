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

/**
 * Identify the client. Requests without a User-Agent look like scrapers to a
 * WAF, and Canvas's edge answers those with 406 Not Acceptable — which is what
 * took every course page down once the site started making more API calls.
 * Node's fetch sends no User-Agent unless told to.
 */
const USER_AGENT =
  'academic-website-cristina (+https://cristina8455.vercel.app; Canvas course mirror)';

/**
 * Canvas throttles with 403 plus a rate-limit body, not only with 429 — and
 * its edge returns 406 when it decides a request looks automated. All three
 * are worth another try.
 */
async function isThrottled(response: Response): Promise<boolean> {
  if (response.status === 429 || response.status === 406) return true;
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
          'User-Agent': USER_AGENT,
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
    .replace(/<script\b[^>]*\/>/gi, '')
    // Canvas decorates internal links with these on ingest. They mean nothing
    // outside Canvas's own JavaScript, they publish internal API paths, and
    // they survive link rewriting — leaving a local href sitting next to a
    // data-api-endpoint still pointing at Canvas. (canvaskit.canonical_html
    // strips the same set, for its own reasons.)
    .replace(/\s+data-(?:api-endpoint|api-returntype|course-type|published)="[^"]*"/gi, '');
}

/**
 * Point Canvas file links at published copies where they exist.
 *
 * Around 1,400 links in the mirrored pages are PDFs — guided notes, completed
 * notes, practice sets — and every one of them is behind CLC's single sign-on,
 * so a visitor who is not enrolled cannot open any of them.
 *
 * `lookup` returns a published URL for a Canvas file id, or null. Null is the
 * normal case, not an error: if nothing is published, or the CDN is not
 * configured, or a particular file was left out, the link stays on Canvas and
 * `markCanvasLinks` labels it. The published copies are an enhancement layered
 * on top, never something the page depends on.
 */
export function rewriteCanvasFileLinks(
  html: string,
  lookup: (canvasFileId: string) => string | null
): string {
  return html.replace(
    /href="(https?:\/\/[a-z0-9.-]+\.instructure\.com\/[^"]*?\/files\/(\d+)[^"]*)"/gi,
    (match, _original: string, fileId: string) => {
      const published = lookup(fileId);
      return published ? `href="${published}"` : match;
    }
  );
}

/**
 * Flag links that lead back into Canvas so they announce themselves.
 *
 * Whatever is left pointing at Canvas after `rewriteCanvasLinks` — assignments,
 * quizzes, discussions, and every file — is behind CLC's single sign-on. A
 * visitor who is not enrolled follows one and lands on a Microsoft login page
 * with no explanation. There are around 1,400 file links alone, so this is the
 * common case, not an edge one.
 *
 * Marks them rather than hiding them: the material genuinely is in Canvas, and
 * a student following the same link is exactly where they should be. Styling
 * lives in globals.css against `.canvas-link`.
 */
export function markCanvasLinks(html: string): string {
  return html.replace(
    /<a\b([^>]*?)href="(https?:\/\/[a-z0-9.-]+\.instructure\.com\/[^"]*)"([^>]*)>/gi,
    (match, before: string, href: string, after: string) => {
      const attrs = `${before} ${after}`;
      // Leave anything already marked or already opening in a new tab alone.
      if (/canvas-link/.test(attrs)) return match;

      const rest = `${before}${after}`.replace(/\s+/g, ' ').trim();
      const existingClass = rest.match(/class="([^"]*)"/i);
      const cleaned = rest
        .replace(/\s*class="[^"]*"/i, '')
        .replace(/\s*target="[^"]*"/i, '')
        .replace(/\s*rel="[^"]*"/i, '');
      const className = existingClass ? `${existingClass[1]} canvas-link` : 'canvas-link';

      return `<a ${cleaned} href="${href}" class="${className}" target="_blank" ` +
             `rel="noopener noreferrer" title="Opens in Canvas — CLC login required">`;
    }
  );
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
