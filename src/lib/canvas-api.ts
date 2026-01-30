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
  page_id: string;
  url: string;
  title: string;
  body: string;
  published: boolean;
  front_page: boolean;
  updated_at: string;
}

export interface CanvasPageSummary {
  page_id: string;
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
 * Make an authenticated request to Canvas API
 */
async function canvasFetch<T>(endpoint: string): Promise<T> {
  const { baseUrl, token } = getConfig();

  if (!baseUrl || !token) {
    console.error('Canvas API credentials not configured');
    throw new Error('Canvas API credentials not configured. Set CANVAS_BASE_URL and CANVAS_API_TOKEN.');
  }

  const url = `${baseUrl}${endpoint}`;

  // Add timeout to prevent hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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

    if (!response.ok) {
      throw new CanvasAPIError(
        `Canvas API error: ${response.status} ${response.statusText}`,
        response.status,
        endpoint
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Canvas API request timed out: ${endpoint}`);
    }
    throw error;
  }
}

/**
 * Get all courses where user is a teacher
 */
export async function getTeacherCourses(): Promise<CanvasCourse[]> {
  const courses = await canvasFetch<CanvasCourse[]>(
    '/api/v1/courses?enrollment_type=teacher&state[]=available&include[]=term&per_page=100'
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
  const pages = await canvasFetch<CanvasPageSummary[]>(
    `/api/v1/courses/${courseId}/pages?per_page=100`
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
 * Find the "Notes and Assignments" page for a course
 * Looks for pages with common naming patterns
 */
export async function getNotesAndAssignmentsPage(courseId: number): Promise<CanvasPage | null> {
  const pages = await getCoursePages(courseId);

  // Look for common naming patterns (case-insensitive)
  // Priority order: most specific first
  const patterns = [
    /notes\s*(and|&)\s*assignments/i,       // Current naming: "Notes and Assignments"
    /calendar\s*(and|&)\s*daily\s*notes/i,  // Fall 2024 naming: "Calendar and Daily Notes"
    /daily\s*notes\s*(and|&)\s*calendar/i,  // Alternate ordering
    /course\s*calendar/i,
    /schedule/i,
  ];

  for (const pattern of patterns) {
    const match = pages.find(p => pattern.test(p.title));
    if (match) {
      return getCoursePage(courseId, match.url);
    }
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
function parseTimeRange(timeStr: string): { start: string; end: string } | null {
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
function normalizeDay(day: string): string {
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
function parseScheduleLine(
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
