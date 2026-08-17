import Link from 'next/link';
import { BookOpen, ChevronRight, Clock } from 'lucide-react';
import { getCourseFamilies } from '@/lib/families';

export const revalidate = 86400;

export const metadata = {
  title: 'Teaching',
  description: 'Courses taught at the College of Lake County, by course.',
};

/**
 * Courses by course number rather than by term.
 *
 * `/courses` remains the chronological view — that is what a student following
 * a live course wants, and it stays the default. This view answers a different
 * question: what has she taught, and for how long. Seven terms of MTH 122 is
 * one course developed over three years, not seven unrelated list entries.
 */
export default async function TeachingPage() {
  const families = await getCourseFamilies();

  const totalSections = families.reduce((n, f) => n + f.courses.length, 0);
  const terms = new Set(families.flatMap(f => f.terms.map(t => t.slug))).size;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-card-foreground">Teaching</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Mathematics courses at the College of Lake County, grouped by course. Each one links
            to every term it has been taught, with the calendar, syllabus and materials for that
            term.
          </p>
          <p className="text-sm text-muted-foreground mt-3 tabular-nums">
            {families.length} courses · {totalSections} sections · {terms} terms
            {' · '}
            <Link href="/courses" className="text-primary hover:underline">
              browse by term instead
            </Link>
          </p>
        </header>

        <div className="grid gap-3 md:grid-cols-2">
          {families.map(family => (
            <Link
              key={family.code}
              href={`/teaching/${family.code.toLowerCase()}`}
              className="bg-card rounded-lg border border-border p-5 group
                         hover:border-primary/20 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-primary">{family.label}</p>
                  <h2 className="font-semibold text-card-foreground mt-0.5">{family.name}</h2>
                </div>
                <BookOpen size={18} className="text-primary opacity-70 flex-shrink-0" />
              </div>

              <p className="text-sm text-muted-foreground mt-3 flex items-center tabular-nums">
                <Clock size={14} className="mr-1.5 opacity-70" />
                {family.terms.length} {family.terms.length === 1 ? 'term' : 'terms'}
                {family.courses.length !== family.terms.length &&
                  ` · ${family.courses.length} sections`}
              </p>

              <p className="text-xs text-muted-foreground/80 mt-1">
                {family.terms[family.terms.length - 1]?.name}
                {family.terms.length > 1 && ` – ${family.terms[0]?.name}`}
              </p>

              <span className="text-sm text-primary inline-flex items-center mt-3">
                View course
                <ChevronRight
                  size={14}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
