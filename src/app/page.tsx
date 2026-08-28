import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getHomepageCourses, type Course } from '@/lib/courses';
import { getTeachingRecord, familyCode, familyLabel, courseTitle,
         type TeachingRecord } from '@/lib/families';
import { profile, officeLabel, officeHours } from '@/lib/profile';

export const revalidate = 86400;

/**
 * The front page.
 *
 * Not a grid of cards. Cards give every element equal weight, which on a page
 * whose job is to say what someone does is exactly backwards. This is three
 * things in descending order of importance: who she is, what is running now,
 * and the record behind it — separated by rules rather than boxed, so the
 * hierarchy comes from typography and space instead of from borders.
 */
export default async function Home() {
  const [{ courses, termName, isCurrent }, record] = await Promise.all([
    getHomepageCourses(),
    getTeachingRecord(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-5 sm:px-8">

        {/* Opening. A typographic statement, not a headshot in a box. */}
        <section className="pt-14 sm:pt-24 pb-12">
          <div className="flex items-start gap-8">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-brass">
                Mathematics &amp; Statistics
              </p>
              <h1 className="font-serif font-semibold text-[clamp(2.4rem,7vw,4rem)]
                             leading-[1.04] tracking-[-0.022em] mt-4 text-foreground">
                {profile.name}
              </h1>
              <p className="font-serif text-lg sm:text-xl leading-relaxed text-muted-foreground
                            mt-5 max-w-[42ch]">
                I teach algebra, precalculus, statistics and calculus at the{' '}
                {profile.institution}. Course materials for every section I have taught are
                collected here.
              </p>
            </div>

            {/* Small, aligned to the type rather than floating in a card. */}
            <Image
              src="/headshotCK.jpg"
              alt=""
              width={104}
              height={104}
              className="hidden sm:block rounded-sm object-cover flex-shrink-0 mt-1
                         grayscale-[0.15] saturate-[0.95]"
              priority
            />
          </div>
        </section>

        {/* Now teaching. A list with hierarchy, not equal-weight tiles. */}
        <section className="border-t border-foreground/15 py-10">
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
              {isCurrent ? 'Now teaching' : 'Most recent term'}
              {termName && <span className="text-brass"> · {termName}</span>}
            </h2>
            <Link
              href="/courses"
              className="text-sm text-primary hover:underline underline-offset-2 flex-shrink-0"
            >
              All terms
            </Link>
          </div>

          {courses.length === 0 ? (
            <p className="text-muted-foreground">
              Courses for the upcoming term will be posted here before the semester begins.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {courses.map(course => (
                <CourseRow
                  key={course.id}
                  course={course}
                  title={courseTitle(
                    course.name,
                    record.families.find(f => f.code === familyCode(course.code))?.name
                      ?? course.name
                  )}
                />
              ))}
            </ul>
          )}
        </section>

        {/* The record. The one thing here no template has. */}
        <section className="border-t border-foreground/15 py-10">
          <div className="flex items-baseline justify-between gap-4 mb-6">
            <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
              Teaching record
            </h2>
            <Link
              href="/teaching"
              className="text-sm text-primary hover:underline underline-offset-2 flex-shrink-0"
            >
              By course
            </Link>
          </div>
          <RecordGrid record={record} />
        </section>

        {/* Practical detail, kept quiet. */}
        <section className="border-t border-foreground/15 py-10 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-3">
              Office hours
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              In person in {officeLabel}, and on Zoom.
            </p>
            <Link href="/office-hours" className="text-sm text-primary hover:underline underline-offset-2">
              {officeHours.term} schedule
            </Link>
          </div>
          <div>
            <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground mb-3">
              Contact
            </h2>
            <p className="text-sm text-muted-foreground">
              <a href={`mailto:${profile.email}`} className="text-primary hover:underline underline-offset-2">
                {profile.email}
              </a>
              <br />
              {officeLabel}, {profile.institution}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

/** One current course. Number leads, because that is how students name them. */
function CourseRow({ course, title }: { course: Course; title: string }) {
  const code = familyCode(course.code);
  const section = course.code.replace(/^[A-Za-z]+\s*\d{3}\s*/, '').trim();

  return (
    <li>
      <Link
        href={`/courses/${course.term?.slug}/${course.slug}`}
        className="group flex items-baseline gap-4 py-4 -mx-2 px-2 rounded
                   hover:bg-muted/60 transition-colors"
      >
        <span className="font-mono text-sm text-brass tabular-nums w-[4.5rem] flex-shrink-0">
          {familyLabel(code)}
        </span>
        <span className="font-serif text-lg text-foreground flex-1 min-w-0 truncate">
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

/**
 * Courses down, terms across. A filled cell means the course ran that term;
 * the number is how many sections. The shape is the point — which course is
 * the staple, which is new, where the gaps fall.
 */
function RecordGrid({ record }: { record: TeachingRecord }) {
  const { terms, families, totals } = record;

  return (
    <div>
      <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[34rem] border-collapse">
          <thead>
            <tr>
              <th className="text-left font-normal pb-3 pr-4 w-px whitespace-nowrap">
                <span className="sr-only">Course</span>
              </th>
              {terms.map(term => (
                <th
                  key={term.slug}
                  scope="col"
                  className="font-mono text-[10px] tracking-[0.08em] uppercase
                             text-muted-foreground font-normal pb-3 px-1 text-center"
                >
                  <abbr title={term.name} className="no-underline">{term.short}</abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {families.map(family => (
              <tr key={family.code} className="border-t border-border">
                <th scope="row" className="text-left py-2.5 pr-5 whitespace-nowrap font-normal">
                  <Link
                    href={`/teaching/${family.code.toLowerCase()}`}
                    className="group inline-flex items-baseline gap-2.5"
                  >
                    <span className="font-mono text-xs text-brass tabular-nums">
                      {family.label}
                    </span>
                    <span className="font-serif text-sm text-foreground
                                     group-hover:text-primary transition-colors">
                      {family.name}
                    </span>
                  </Link>
                </th>

                {terms.map(term => {
                  const sections = family.byTerm[term.slug];
                  return (
                    <td key={term.slug} className="px-1 py-2.5 text-center">
                      {sections ? (
                        <span
                          title={`${family.label}, ${term.name}: ${sections} section${sections === 1 ? '' : 's'}`}
                          className="inline-flex items-center justify-center w-6 h-6 rounded-sm
                                     bg-primary/12 text-primary font-mono text-[11px] tabular-nums"
                        >
                          {sections}
                        </span>
                      ) : (
                        <span className="inline-block w-6 h-6 align-middle" aria-hidden="true">
                          <span className="block w-1 h-1 rounded-full bg-border mx-auto mt-2.5" />
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground mt-5 tabular-nums">
        {totals.courses} courses · {totals.sections} sections · {totals.terms} terms
      </p>
    </div>
  );
}
