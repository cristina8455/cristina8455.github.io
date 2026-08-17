import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllCourses, getAllTerms, type Course } from '@/lib/courses';
import { familyCode, familyLabel } from '@/lib/families';

export const revalidate = 86400;

export const metadata = {
  title: 'Courses',
  description: 'Every course by term, newest first.',
};

/**
 * The chronological view. Terms as a spine, courses hanging off it.
 *
 * Cards were doing nothing here except drawing a box around each course and
 * making every term look equally recent. A term heading with a rule under it
 * and a plain list beneath carries the same information with the hierarchy
 * intact, and it scans far faster once there are nine of them.
 */
export default async function CoursesPage() {
  const [courses, terms] = await Promise.all([getAllCourses(), getAllTerms()]);
  const now = new Date();

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-5 sm:px-8">
        <header className="pt-12 sm:pt-16 pb-8">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-brass">
            By term
          </p>
          <h1 className="font-serif font-semibold text-[clamp(1.9rem,4.5vw,2.75rem)]
                         leading-[1.08] tracking-[-0.02em] mt-3 text-foreground">
            Courses
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4 max-w-[46ch]">
            Every course by term, newest first — or{' '}
            <Link href="/teaching" className="text-primary hover:underline underline-offset-2">
              browse by course
            </Link>{' '}
            to see each one across the terms it has been taught.
          </p>
        </header>

        <div className="pb-10">
          {terms.map(term => {
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
                    <CourseRow key={course.id} course={course} termSlug={term.slug} />
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

function CourseRow({ course, termSlug }: { course: Course; termSlug: string }) {
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
          {course.name}
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
