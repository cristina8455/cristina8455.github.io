/**
 * Course data utilities
 *
 * Higher-level functions for working with courses from Canvas.
 * Handles slug generation, grouping, and lookups.
 */

import {
  getTeacherCourses,
  getCourse,
  getCoursePages,
  getCoursePage,
  getNotesAndAssignmentsPage,
  type CanvasCourse,
  type CanvasPage,
  type CanvasPageSummary,
} from './canvas-api';

// Processed course type for use in the app
export interface Course {
  id: number;
  name: string;
  code: string;
  slug: string;
  term: {
    id: number;
    name: string;
    slug: string;
    endAt: Date | null;
  } | null;
  syllabusHtml?: string;
}

export interface CourseWithPages extends Course {
  pages: CanvasPageSummary[];
  notesPage: CanvasPage | null;
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Transform a Canvas course into our app's course format
 */
function transformCourse(canvas: CanvasCourse): Course {
  return {
    id: canvas.id,
    name: canvas.name,
    code: canvas.course_code,
    slug: generateSlug(canvas.course_code),
    term: canvas.term ? {
      id: canvas.term.id,
      name: canvas.term.name,
      slug: generateSlug(canvas.term.name),
      endAt: canvas.term.end_at ? new Date(canvas.term.end_at) : null,
    } : null,
    syllabusHtml: canvas.syllabus_body,
  };
}

/**
 * Check if a term is Fall 2024 or later
 * Terms before Fall 2024 should be excluded (before she started teaching here)
 */
function isTermFall2024OrLater(termName: string): boolean {
  // Parse term like "Fall 2024", "Spring 2025", etc.
  const match = termName.match(/(Spring|Summer|Fall)\s*(\d{4})/i);
  if (!match) return false;

  const season = match[1].toLowerCase();
  const year = parseInt(match[2]);

  // Fall 2024 is the cutoff
  if (year > 2024) return true;
  if (year === 2024 && season === 'fall') return true;
  return false;
}

/**
 * Check if a course should be excluded
 */
function shouldExcludeCourse(course: Course): boolean {
  // Exclude "Math Dept Resources" or similar
  if (/math\s*dept\s*resources/i.test(course.name)) return true;
  if (/math\s*dept\s*resources/i.test(course.code)) return true;

  return false;
}

/**
 * Get all courses, transformed and sorted
 */
export async function getAllCourses(): Promise<Course[]> {
  const canvasCourses = await getTeacherCourses();

  return canvasCourses
    .map(transformCourse)
    .filter(c => c.term !== null && c.term.name.trim() !== '') // Only include courses with real terms
    .filter(c => c.term !== null && isTermFall2024OrLater(c.term.name)) // Only Fall 2024 and later
    .filter(c => !shouldExcludeCourse(c)) // Exclude specific courses
    .sort((a, b) => {
      // Sort by term ID descending (newest first)
      if (a.term && b.term) {
        return b.term.id - a.term.id;
      }
      return 0;
    });
}

/**
 * Get courses grouped by term
 */
export async function getCoursesByTerm(): Promise<Map<string, Course[]>> {
  const courses = await getAllCourses();
  const grouped = new Map<string, Course[]>();

  for (const course of courses) {
    if (!course.term) continue;

    const termSlug = course.term.slug;
    if (!grouped.has(termSlug)) {
      grouped.set(termSlug, []);
    }
    grouped.get(termSlug)!.push(course);
  }

  return grouped;
}

/**
 * Get current term courses (term hasn't ended yet)
 */
export async function getCurrentCourses(): Promise<Course[]> {
  const courses = await getAllCourses();
  const now = new Date();

  return courses.filter(c => {
    if (!c.term?.endAt) return true; // No end date = assume current
    return c.term.endAt > now;
  });
}

/**
 * Get archived courses (term has ended)
 */
export async function getArchivedCourses(): Promise<Course[]> {
  const courses = await getAllCourses();
  const now = new Date();

  return courses.filter(c => {
    if (!c.term?.endAt) return false;
    return c.term.endAt <= now;
  });
}

/**
 * Find a course by term slug and course slug
 */
export async function getCourseBySlug(termSlug: string, courseSlug: string): Promise<Course | null> {
  const courses = await getAllCourses();

  return courses.find(c =>
    c.term?.slug === termSlug && c.slug === courseSlug
  ) || null;
}

/**
 * Get a course with its pages loaded
 */
export async function getCourseWithPages(termSlug: string, courseSlug: string): Promise<CourseWithPages | null> {
  const course = await getCourseBySlug(termSlug, courseSlug);
  if (!course) return null;

  // Fetch pages and notes page in parallel
  const [pages, notesPage, fullCourse] = await Promise.all([
    getCoursePages(course.id),
    getNotesAndAssignmentsPage(course.id),
    getCourse(course.id),
  ]);

  return {
    ...course,
    syllabusHtml: fullCourse.syllabus_body,
    pages,
    notesPage,
  };
}

/**
 * Get a specific page from a course
 */
export async function getCoursePageBySlug(
  termSlug: string,
  courseSlug: string,
  pageSlug: string
): Promise<{ course: Course; page: CanvasPage } | null> {
  const course = await getCourseBySlug(termSlug, courseSlug);
  if (!course) return null;

  try {
    const page = await getCoursePage(course.id, pageSlug);
    return { course, page };
  } catch {
    return null;
  }
}

/**
 * Get all unique terms from courses
 */
export async function getAllTerms(): Promise<Array<{ slug: string; name: string; endAt: Date | null }>> {
  const courses = await getAllCourses();
  const termMap = new Map<string, { slug: string; name: string; endAt: Date | null }>();

  for (const course of courses) {
    if (course.term && !termMap.has(course.term.slug)) {
      termMap.set(course.term.slug, {
        slug: course.term.slug,
        name: course.term.name,
        endAt: course.term.endAt,
      });
    }
  }

  // Sort by end date descending (newest first)
  return Array.from(termMap.values()).sort((a, b) => {
    if (!a.endAt) return -1;
    if (!b.endAt) return 1;
    return b.endAt.getTime() - a.endAt.getTime();
  });
}
