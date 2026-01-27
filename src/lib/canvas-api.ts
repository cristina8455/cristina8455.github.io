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
