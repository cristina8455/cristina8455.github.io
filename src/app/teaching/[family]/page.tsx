import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCourseFamily } from '@/lib/families';

export const revalidate = 86400;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ family: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { family } = await params;
  const found = await getCourseFamily(family);
  if (!found) return { title: 'Course Not Found' };

  return {
    title: `${found.label} · ${found.name}`,
    description: `${found.name} at the College of Lake County, taught across ` +
                 `${found.terms.length} term${found.terms.length === 1 ? '' : 's'}.`,
  };
}

/**
 * One course, every term it has been taught.
 *
 * Deliberately thin on interpretation. Everything here is derived from the
 * course data — how many terms, which sections, what is available for each —
 * and nothing asserts anything about how or why the course is taught. That
 * belongs in her words, and this page is the place it will go.
 */
export default async function FamilyPage({ params }: PageProps) {
  const { family } = await params;
  const found = await getCourseFamily(family);

  if (!found) {
    notFound();
  }

  const span = found.terms.length > 1
    ? `${found.terms[found.terms.length - 1].name} – ${found.terms[0].name}`
    : found.terms[0]?.name;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-5 sm:px-8">
        <header className="pt-12 sm:pt-16 pb-8">
          <Link
            href="/teaching"
            className="inline-flex items-center text-sm text-muted-foreground
                       hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={15} className="mr-1.5" />
            All courses
          </Link>

          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-brass">
            {found.label}
          </p>
          <h1 className="font-serif font-semibold text-[clamp(1.9rem,4.5vw,2.75rem)]
                         leading-[1.08] tracking-[-0.02em] mt-3 text-foreground">
            {found.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-4 tabular-nums">
            {found.terms.length} {found.terms.length === 1 ? 'term' : 'terms'}
            {found.courses.length !== found.terms.length && ` · ${found.courses.length} sections`}
            {span && ` · ${span}`}
          </p>
        </header>

        <div className="pb-10">
          {found.terms.map(term => (
            <section key={term.slug} className="border-t border-foreground/15 py-7">
              <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase
                             text-muted-foreground mb-4">
                {term.name}
              </h2>

              <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {term.courses.map(course => (
                  <div key={course.id} className="min-w-0">
                    <p className="font-mono text-sm text-foreground tabular-nums">
                      {course.code}
                    </p>
                    <p className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <Link
                        href={`/courses/${term.slug}/${course.slug}`}
                        className="text-sm text-primary hover:underline underline-offset-2"
                      >
                        Calendar &amp; materials
                      </Link>
                      <Link
                        href={`/courses/${term.slug}/${course.slug}/syllabus`}
                        className="text-sm text-muted-foreground hover:text-foreground
                                   transition-colors"
                      >
                        Syllabus
                      </Link>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
