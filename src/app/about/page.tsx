import Image from 'next/image';
import Link from 'next/link';
import { getTeachingRecord } from '@/lib/families';
import { profile, officeLabel, officeLocation } from '@/lib/profile';

export const revalidate = 86400;

export const metadata = {
  title: 'About',
  description: 'Cristina Sizemore — mathematics and statistics at the College of Lake County.',
};

/**
 * About.
 *
 * The prose here is hers and is left exactly as it was; only the presentation
 * changed. What is new is factual context derived from the course data — how
 * many courses, sections and terms — so the page says something concrete
 * about the work rather than only describing an approach.
 */
export default async function About() {
  const { totals, families } = await getTeachingRecord();

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-5 sm:px-8">
        <header className="pt-12 sm:pt-16 pb-8">
          <div className="flex items-start gap-8">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-brass">
                Mathematics &amp; Statistics · {profile.institution}
              </p>
              <h1 className="font-serif font-semibold text-[clamp(1.9rem,4.5vw,2.75rem)]
                             leading-[1.08] tracking-[-0.02em] mt-3 text-foreground">
                {profile.name}
              </h1>
            </div>
            <Image
              src="/headshotCK.jpg"
              alt=""
              width={96}
              height={96}
              className="hidden sm:block rounded-sm object-cover flex-shrink-0 mt-1
                         grayscale-[0.15] saturate-[0.95]"
            />
          </div>
        </header>

        <div className="border-t border-foreground/15 py-10
                        grid gap-x-14 gap-y-10 md:grid-cols-[minmax(0,1fr)_15rem]">

          {/* Her words, unchanged. */}
          <div className="space-y-9">
            <section className="space-y-4 font-serif text-[17px] leading-relaxed text-foreground">
              <p>
                I specialize in mathematics and statistics education, with a focus on making
                complex concepts accessible and meaningful to students. My teaching approach
                emphasizes practical applications and building a strong foundation for further
                study.
              </p>
              <p>
                With a background in mathematical modeling, I bring real-world applications into
                the classroom to help students understand how mathematical concepts apply in
                various fields and careers.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase
                             text-muted-foreground mb-4">
                Teaching philosophy
              </h2>
              <div className="space-y-4 font-serif text-[17px] leading-relaxed text-foreground">
                <p>
                  I believe in creating an inclusive learning environment where students feel
                  comfortable asking questions and exploring mathematical concepts. My goal is to
                  help students develop not just technical skills, but also critical thinking and
                  problem-solving abilities that will serve them in their future studies and
                  careers.
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-5">
                <Link href="/teaching" className="text-primary hover:underline underline-offset-2">
                  How a course runs
                </Link>{' '}
                describes what that looks like week to week.
              </p>
            </section>
          </div>

          {/* Facts, derived rather than asserted. */}
          <aside className="space-y-8">
            <div>
              <h2 className="font-mono text-[10px] tracking-[0.14em] uppercase text-brass mb-3">
                Courses taught
              </h2>
              <ul className="space-y-1.5 text-sm">
                {families.map(family => (
                  <li key={family.code}>
                    <Link
                      href={`/teaching/${family.code.toLowerCase()}`}
                      className="group flex items-baseline gap-2.5"
                    >
                      <span className="font-mono text-xs text-muted-foreground tabular-nums
                                       w-[4.25rem] flex-shrink-0">
                        {family.label}
                      </span>
                      <span className="text-foreground group-hover:text-primary
                                       transition-colors min-w-0 truncate">
                        {family.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground mt-3 tabular-nums">
                {totals.sections} sections across {totals.terms} terms
              </p>
            </div>

            <div>
              <h2 className="font-mono text-[10px] tracking-[0.14em] uppercase text-brass mb-3">
                Contact
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <a
                  href={`mailto:${profile.email}`}
                  className="text-primary hover:underline underline-offset-2 break-words"
                >
                  {profile.email}
                </a>
                <br />
                {officeLabel}
                <br />
                {officeLocation}
              </p>
              <p className="text-sm mt-3">
                <Link href="/office-hours" className="text-primary hover:underline underline-offset-2">
                  Office hours
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
