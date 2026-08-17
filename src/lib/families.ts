import { getAllCourses, type Course } from '@/lib/courses';

/**
 * Courses grouped by course number rather than by term.
 *
 * The site has always listed courses chronologically, which is what a student
 * following a live course wants. But she has taught MTH 122 seven times, and
 * as a list of terms that reads as seven unrelated entries rather than one
 * course developed over three years. Both views are useful; this is the second
 * one, over exactly the same data.
 */

export interface CourseFamily {
  /** "MTH122" — subject and number, without the section. */
  code: string;
  /** "MTH 122", for display. */
  label: string;
  /** "College Algebra" — cleaned of section and meeting-time noise. */
  name: string;
  /** Every section taught, newest term first. */
  courses: Course[];
  /** Distinct terms, newest first. */
  terms: Array<{ slug: string; name: string; courses: Course[] }>;
}

/**
 * Subject and number, dropping the section: "MTH122 201/202" -> "MTH122".
 *
 * The number is bounded to three digits because CLC course numbers are three
 * digits and section numbers follow them. An unbounded `\d+` swallows both
 * when there is no separator ("MTH146004" -> "MTH146004"), and nothing in the
 * string says where the course number ends.
 */
export function familyCode(courseCode: string): string {
  const match = courseCode.match(/^([A-Za-z]+)\s*(\d{3})/);
  return match ? `${match[1].toUpperCase()}${match[2]}` : courseCode.toUpperCase();
}

/** "MTH122" -> "MTH 122". */
export function familyLabel(code: string): string {
  const match = code.match(/^([A-Za-z]+)(\d+)$/);
  return match ? `${match[1]} ${match[2]}` : code;
}

/**
 * Pick a clean title for the course.
 *
 * Canvas course names carry whatever was typed when the shell was created, so
 * they arrive with section numbers, meeting times and term names glued on —
 * "General Education Statistics Section 8 MW 2:30pm". Strip that and prefer
 * the shortest remaining candidate, which is reliably the actual course title.
 */
export function familyName(names: string[]): string {
  const cleaned = names
    .map(name =>
      name
        .replace(/\bsections?\s*\d+[a-z]?\b/gi, '')
        .replace(/\b(?:spring|summer|fall|winter)\s*\d{4}\b/gi, '')
        // Meeting days written with separators: "T/Th", "M/W/F".
        .replace(/\b(?:M|Tu?|W|R|Th|F|Sa?|Su?)(?:\s*[/,]\s*(?:M|Tu?|W|R|Th|F|Sa?|Su?))+\b/g, '')
        // Meeting days run together. Case-sensitive so ordinary words survive.
        .replace(/\b(?:MWF|MTWTh|MTWR|TTh|MW|TR|MF)\b/g, '')
        .replace(/\b\d{1,2}(?::\d{2})?\s*[ap]\.?m\.?\b/gi, '')
        .replace(/\s*[-–—:]\s*$/, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
    )
    .filter(Boolean);

  if (cleaned.length === 0) return names[0] || '';

  // Most sections agree on the real title, so take the most common spelling
  // rather than the shortest — shortest alone turns "Contemporary Mathematics"
  // into "Contemporary Math" whenever one section was named carelessly.
  // Shortest breaks a tie, which drops trailing qualifiers like "Online".
  const counts = new Map<string, number>();
  for (const name of cleaned) counts.set(name, (counts.get(name) ?? 0) + 1);

  return [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].length - b[0].length
  )[0][0];
}

export async function getCourseFamilies(): Promise<CourseFamily[]> {
  const courses = await getAllCourses();
  const grouped = new Map<string, Course[]>();

  for (const course of courses) {
    const code = familyCode(course.code);
    const list = grouped.get(code);
    if (list) list.push(course);
    else grouped.set(code, [course]);
  }

  const families: CourseFamily[] = [];

  for (const [code, list] of grouped) {
    // getAllCourses is already newest-term-first, so term order follows.
    const terms: CourseFamily['terms'] = [];
    for (const course of list) {
      if (!course.term) continue;
      const existing = terms.find(t => t.slug === course.term!.slug);
      if (existing) existing.courses.push(course);
      else terms.push({ slug: course.term.slug, name: course.term.name, courses: [course] });
    }

    families.push({
      code,
      label: familyLabel(code),
      name: familyName(list.map(c => c.name)),
      courses: list,
      terms,
    });
  }

  // Most-taught first: breadth is the thing this view exists to show.
  return families.sort((a, b) =>
    b.courses.length - a.courses.length || a.code.localeCompare(b.code)
  );
}

export async function getCourseFamily(code: string): Promise<CourseFamily | null> {
  const families = await getCourseFamilies();
  const wanted = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return families.find(f => f.code === wanted) ?? null;
}

export interface TeachingRecord {
  /** Terms oldest first, so the grid reads left to right as time. */
  terms: Array<{ slug: string; name: string; short: string }>;
  families: Array<{
    code: string;
    label: string;
    name: string;
    /** Section count per term slug; absent means not taught that term. */
    byTerm: Record<string, number>;
    total: number;
  }>;
  totals: { courses: number; sections: number; terms: number };
}

/** "Spring 2026" -> "Sp 26", for a grid column head. */
function shortTerm(name: string): string {
  const match = name.match(/(Spring|Summer|Fall|Winter)\s*(\d{4})/i);
  if (!match) return name;
  const season = { spring: 'Sp', summer: 'Su', fall: 'Fa', winter: 'Wi' }[match[1].toLowerCase()]!;
  return `${season} ${match[2].slice(2)}`;
}

/**
 * Courses against terms, as a grid.
 *
 * Nine terms and twenty-one sections is the most distinctive thing about this
 * record, and as a list it reads as twenty-one unrelated rows. Laid out as
 * courses down and terms across, the shape of a teaching career is legible in
 * one glance — which course is the staple, which is new, where the gaps are.
 */
export async function getTeachingRecord(): Promise<TeachingRecord> {
  const families = await getCourseFamilies();

  const termMap = new Map<string, { slug: string; name: string; endAt: Date | null }>();
  for (const family of families) {
    for (const course of family.courses) {
      if (course.term && !termMap.has(course.term.slug)) {
        termMap.set(course.term.slug, {
          slug: course.term.slug,
          name: course.term.name,
          endAt: course.term.endAt,
        });
      }
    }
  }

  const terms = [...termMap.values()]
    .sort((a, b) => (a.endAt?.getTime() ?? 0) - (b.endAt?.getTime() ?? 0))
    .map(t => ({ slug: t.slug, name: t.name, short: shortTerm(t.name) }));

  const rows = families.map(family => {
    const byTerm: Record<string, number> = {};
    for (const course of family.courses) {
      if (!course.term) continue;
      byTerm[course.term.slug] = (byTerm[course.term.slug] ?? 0) + 1;
    }
    return {
      code: family.code,
      label: family.label,
      name: family.name,
      byTerm,
      total: family.courses.length,
    };
  });

  return {
    terms,
    families: rows,
    totals: {
      courses: rows.length,
      sections: rows.reduce((n, r) => n + r.total, 0),
      terms: terms.length,
    },
  };
}
