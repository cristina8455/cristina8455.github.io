import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
            By course
          </p>
          <h1 className="font-serif font-semibold text-[clamp(1.9rem,4.5vw,2.75rem)]
                         leading-[1.08] tracking-[-0.02em] mt-3 text-foreground">
            Teaching
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4 max-w-[46ch]">
            Mathematics courses at the College of Lake County. Each links to every term it has
            been taught, with the calendar, syllabus and materials for that term.
          </p>
          <p className="text-sm text-muted-foreground mt-4 tabular-nums">
            {families.length} courses · {sections} sections · {terms} terms ·{' '}
            <Link href="/courses" className="text-primary hover:underline underline-offset-2">
              by term instead
            </Link>
          </p>
        </header>

        <ul className="border-t border-foreground/15 divide-y divide-border pb-10">
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
      </main>
    </div>
  );
}
