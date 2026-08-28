import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllCourses, getAllTerms, type Course } from '@/lib/courses';
import { getCourseFamilies, familyCode, familyLabel, courseTitle } from '@/lib/families';

export const revalidate = 86400;

export const metadata = {
  title: 'Courses',
  description: 'Every course, by term or by course.',
};

interface PageProps {
  searchParams: Promise<{ by?: string }>;
}

/**
 * The chronological view. Terms as a spine, courses hanging off it.
 *
 * Cards were doing nothing here except drawing a box around each course and
 * making every term look equally recent. A term heading with a rule under it
 * and a plain list beneath carries the same information with the hierarchy
 * intact, and it scans far faster once there are nine of them.
 */
export default async function CoursesPage({ searchParams }: PageProps) {
  const { by } = await searchParams;
  const byCourse = by === 'course';

  const [courses, terms, families] = await Promise.all([
    getAllCourses(),
    getAllTerms(),
    getCourseFamilies(),
  ]);
  const now = new Date();

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-5 sm:px-8">
        <header className="pt-12 sm:pt-16 pb-8">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-brass">
            {courses.length} sections · {terms.length} terms
          </p>
          <h1 className="font-serif font-semibold text-[clamp(1.9rem,4.5vw,2.75rem)]
                         leading-[1.08] tracking-[-0.02em] mt-3 text-foreground">
            Courses
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4 max-w-[46ch]">
            Everything taught at the College of Lake County, with the calendar, syllabus and
            materials for each term.
          </p>

          {/* A URL toggle rather than client state, so either view can be linked,
              shared and indexed — which matters if one is ever cited. */}
          <div className="mt-7 flex items-center gap-1 text-sm" role="group" aria-label="Group courses">
            <Link
              href="/courses"
              aria-current={!byCourse ? 'true' : undefined}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                !byCourse
                  ? 'bg-primary/12 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              By term
            </Link>
            <Link
              href="/courses?by=course"
              aria-current={byCourse ? 'true' : undefined}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                byCourse
                  ? 'bg-primary/12 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              By course
            </Link>
          </div>
        </header>

        <div className="pb-10">
          {byCourse ? (
            <ul className="border-t border-foreground/15 divide-y divide-border">
              {families.map(family => (
                <li key={family.code}>
                  <Link
                    href={`/teaching/${family.code.toLowerCase()}`}
                    className="group flex items-baseline gap-4 sm:gap-6 py-5 -mx-2 px-2 rounded
                               hover:bg-muted/60 transition-colors"
                  >
                    <span className="font-mono text-sm text-brass tabular-nums w-[4.5rem] flex-shrink-0">
                      {family.label}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-serif text-lg sm:text-xl text-foreground truncate">
                        {family.name}
                      </span>
                      <span className="block text-sm text-muted-foreground mt-0.5 tabular-nums">
                        {family.terms.length} {family.terms.length === 1 ? 'term' : 'terms'}
                        {family.courses.length !== family.terms.length &&
                          ` · ${family.courses.length} sections`}
                        {' · '}
                        {family.terms[family.terms.length - 1]?.name}
                        {family.terms.length > 1 && ` – ${family.terms[0]?.name}`}
                      </span>
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-muted-foreground group-hover:text-primary
                                 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : terms.map(term => {
            const inTerm = courses.filter(c => c.term?.slug === term.slug);
            if (inTerm.length === 0) return null;
            const current = !term.endAt || term.endAt > now;

            return (
              <section key={term.slug} className="border-t border-foreground/15 py-8">
                <div className="flex items-baseline gap-3 mb-4">
                  <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                    {term.name}
                  </h2>
                  {current && (
                    <span className="font-mono text-[10px] tracking-[0.1em] uppercase
                                     text-brass border border-brass/40 rounded-sm px-1.5 py-px">
                      current
                    </span>
                  )}
                </div>

                <ul className="divide-y divide-border">
                  {inTerm.map(course => (
                    <CourseRow
                      key={course.id}
                      course={course}
                      termSlug={term.slug}
                      title={courseTitle(
                        course.name,
                        families.find(f => f.code === familyCode(course.code))?.name
                          ?? course.name
                      )}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function CourseRow(
  { course, termSlug, title }: { course: Course; termSlug: string; title: string }
) {
  const code = familyCode(course.code);
  const section = course.code.replace(/^[A-Za-z]+\s*\d{3}\s*/, '').trim();

  return (
    <li>
      <Link
        href={`/courses/${termSlug}/${course.slug}`}
        className="group flex items-baseline gap-4 py-3.5 -mx-2 px-2 rounded
                   hover:bg-muted/60 transition-colors"
      >
        <span className="font-mono text-sm text-brass tabular-nums w-[4.5rem] flex-shrink-0">
          {familyLabel(code)}
        </span>
        <span className="font-serif text-base sm:text-lg text-foreground flex-1 min-w-0 truncate">
          {title}
        </span>
        {section && (
          <span className="hidden sm:block font-mono text-xs text-muted-foreground tabular-nums">
            {section}
          </span>
        )}
        <ArrowRight
          size={15}
          className="text-muted-foreground group-hover:text-primary
                     group-hover:translate-x-0.5 transition-all flex-shrink-0"
        />
      </Link>
    </li>
  );
}
