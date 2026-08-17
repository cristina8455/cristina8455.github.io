import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, ChevronRight, Calendar } from 'lucide-react';
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/teaching"
          className="inline-flex items-center text-muted-foreground hover:text-primary
                     transition-colors mb-4 text-sm"
        >
          <ArrowLeft size={16} className="mr-1" />
          All courses
        </Link>

        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <p className="text-sm font-medium text-primary">{found.label}</p>
          <h1 className="text-2xl font-bold text-card-foreground mt-0.5">{found.name}</h1>
          <p className="text-sm text-muted-foreground mt-2 tabular-nums">
            {found.terms.length} {found.terms.length === 1 ? 'term' : 'terms'}
            {found.courses.length !== found.terms.length && ` · ${found.courses.length} sections`}
            {span && ` · ${span}`}
          </p>
        </div>

        <h2 className="text-lg font-semibold text-card-foreground mb-3 flex items-center">
          <Calendar size={17} className="mr-2 text-primary opacity-90" />
          Terms
        </h2>

        <div className="space-y-3">
          {found.terms.map(term => (
            <div key={term.slug} className="bg-card rounded-lg border border-border p-5">
              <h3 className="font-semibold text-card-foreground">{term.name}</h3>

              <div className="grid gap-2 mt-3 sm:grid-cols-2">
                {term.courses.map(course => (
                  <div
                    key={course.id}
                    className="border border-border rounded-md p-3 flex flex-col gap-2"
                  >
                    <p className="text-sm text-card-foreground">{course.code}</p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/courses/${term.slug}/${course.slug}`}
                        className="inline-flex items-center text-xs px-2.5 py-1 rounded
                                   bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        Calendar &amp; materials
                        <ChevronRight size={12} className="ml-1" />
                      </Link>
                      <Link
                        href={`/courses/${term.slug}/${course.slug}/syllabus`}
                        className="inline-flex items-center text-xs px-2.5 py-1 rounded
                                   border border-border text-muted-foreground
                                   hover:text-primary hover:border-primary/30 transition-colors"
                      >
                        <FileText size={12} className="mr-1" />
                        Syllabus
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
