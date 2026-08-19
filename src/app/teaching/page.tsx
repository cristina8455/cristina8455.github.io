import Link from 'next/link';

import { getCourseFamilies } from '@/lib/families';

export const revalidate = 86400;

export const metadata = {
  title: 'Teaching',
  description: 'Courses taught at the College of Lake County, by course.',
};

/**
 * Courses by number rather than by term.
 *
 * `/courses` stays the chronological default, which is what a student
 * following a live course wants. This answers the other question: what has she
 * taught, and for how long. Ordered most-taught first, because breadth is the
 * thing this view exists to show.
 */
export default async function TeachingPage() {
  const families = await getCourseFamilies();
  const sections = families.reduce((n, f) => n + f.courses.length, 0);
  const terms = new Set(families.flatMap(f => f.terms.map(t => t.slug))).size;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-5 sm:px-8">
        <header className="pt-12 sm:pt-16 pb-8">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-brass">
            {sections} sections · {terms} terms
          </p>
          <h1 className="font-serif font-semibold text-[clamp(1.9rem,4.5vw,2.75rem)]
                         leading-[1.08] tracking-[-0.02em] mt-3 text-foreground">
            Teaching
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4 max-w-[48ch]">
            Mathematics at the College of Lake County — how the courses are put together, and
            what is in them.
          </p>
        </header>

        {/* How a course runs.
          *
          * Deliberately descriptive. Every sentence here states something the
          * course pages demonstrably do — checked against 308 archived lesson
          * pages, where videos, a to-do list, guided notes and named reading
          * each appear on more than 90% of them. Nothing claims a reason.
          * The reason is hers to write, and this is the section it expands
          * into rather than replaces.
          */}
        <section className="border-t border-foreground/15 py-10">
          <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-6">
            How a course runs
          </h2>

          <div className="grid gap-x-12 gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-5 font-serif text-[17px] leading-relaxed text-foreground">
              <p>
                Every course is built the same way, so finding your way around one means
                finding your way around all of them.
              </p>
              <p>
                Each class day has its own page. It lists the sections to read, a short
                video or two to watch, and a to-do list of what to finish before the next
                class. Newer courses open the page with what you should be able to do by
                the end of the day.
              </p>
            </div>

            <dl className="space-y-6">
              <div>
                <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-brass mb-1.5">
                  Guided notes
                </dt>
                <dd className="text-[15px] leading-relaxed text-muted-foreground">
                  Most days come with a partly-written handout that follows along with class.
                  You fill in the rest as we work through it.
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-brass mb-1.5">
                  If you miss a class
                </dt>
                <dd className="text-[15px] leading-relaxed text-muted-foreground">
                  A completed copy of the notes goes up after most classes, alongside the
                  videos and the reading — enough to work through the day on your own.
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.14em] uppercase text-brass mb-1.5">
                  After the term
                </dt>
                <dd className="text-[15px] leading-relaxed text-muted-foreground">
                  Course pages stay up. Materials from every term are collected here, so
                  they remain available once the class has ended.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="border-t border-foreground/15 py-10">
          <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-5">
            The courses
          </h2>
          <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2 mb-6">
            {families.map(family => (
              <li key={family.code}>
                <Link
                  href={`/teaching/${family.code.toLowerCase()}`}
                  className="group flex items-baseline gap-3 py-1"
                >
                  <span className="font-mono text-xs text-brass tabular-nums w-[4.25rem] flex-shrink-0">
                    {family.label}
                  </span>
                  <span className="font-serif text-[17px] text-foreground group-hover:text-primary
                                   transition-colors min-w-0 truncate">
                    {family.name}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                    {family.terms.length}&times;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            <Link href="/courses" className="text-primary hover:underline underline-offset-2">
              Browse every section
            </Link>{' '}
            by term or by course.
          </p>
        </section>
      </main>
    </div>
  );
}
