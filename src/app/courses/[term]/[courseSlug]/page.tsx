// src/app/courses/[term]/[courseSlug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, FileText, ChevronRight } from 'lucide-react';
import { getCourseWithPages } from '@/lib/courses';
import { type CanvasPageSummary } from '@/lib/canvas-api';
import { prepareCanvasHtml } from '@/lib/canvas-html';

// ISR: revalidate every 24 hours
export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    term: string;
    courseSlug: string;
  }>;
}

// Dynamic routes - no static generation at build time
// Pages are generated on-demand and cached via ISR
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps) {
  const { term, courseSlug } = await params;
  const course = await getCourseWithPages(term, courseSlug);

  if (!course) {
    return { title: 'Course Not Found' };
  }

  return {
    title: `${course.name} - ${course.term?.name}`,
    description: `Course materials for ${course.code}`,
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { term, courseSlug } = await params;
  const course = await getCourseWithPages(term, courseSlug);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">{course.name}</h1>
              <p className="text-primary font-medium">{course.code}</p>
              <p className="text-sm text-muted-foreground mt-1">{course.term?.name}</p>
            </div>
            <BookOpen size={32} className="text-primary opacity-80" />
          </div>

          {/* Quick Links — the syllabus link is hidden when Canvas holds no
              syllabus content, rather than leading to an empty page. */}
          {course.hasSyllabus && (
            <div className="flex gap-3 mt-4">
              <Link
                href={`/courses/${term}/${courseSlug}/syllabus`}
                className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary
                           rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                <FileText size={16} className="mr-2" />
                Syllabus
              </Link>
            </div>
          )}
        </div>

        {/* Notes and Assignments Content */}
        {course.notesPage ? (
          <div className="bg-card rounded-lg shadow-sm p-6">
            <div
              className="prose prose-slate dark:prose-invert max-w-none
                         prose-headings:text-card-foreground
                         prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                         prose-table:border-collapse prose-td:border prose-td:border-border prose-td:p-2
                         prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted/50"
              dangerouslySetInnerHTML={{
                __html: prepareCanvasHtml(
                  course.notesPage.body,
                  {
                    courseId: course.id,
                    termSlug: term,
                    courseSlug,
                    publishedSlugs: new Set(course.pages.map(p => p.url.toLowerCase())),
                  }
                ),
              }}
            />
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow-sm p-6">
            <p className="text-muted-foreground">
              No calendar page is published for this course yet. Everything that has been
              published is listed below.
            </p>
          </div>
        )}

        {/* Every published page, always — not only when there is no calendar.
            The calendar is the curated entry point, but a course should not
            become unreachable just because it is missing or still a draft. */}
        <PageIndex pages={course.pages} term={term} courseSlug={courseSlug} />
      </main>
    </div>
  );
}

/** All published pages, day/week material separated from everything else. */
function PageIndex({
  pages,
  term,
  courseSlug,
}: {
  pages: CanvasPageSummary[];
  term: string;
  courseSlug: string;
}) {
  if (pages.length === 0) return null;

  const dayNumber = (title: string) => {
    const match = title.match(/^(?:day|week)\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : null;
  };

  const sequential = pages
    .filter(p => dayNumber(p.title) !== null)
    .sort((a, b) => (dayNumber(a.title) ?? 0) - (dayNumber(b.title) ?? 0));
  const other = pages
    .filter(p => dayNumber(p.title) === null)
    .sort((a, b) => a.title.localeCompare(b.title));

  const groups: Array<[string, CanvasPageSummary[]]> = [
    ['Daily & weekly material', sequential],
    ['Other pages', other],
  ];

  return (
    <details className="bg-card rounded-lg shadow-sm mt-6 group" open={!sequential.length}>
      <summary className="cursor-pointer select-none p-6 flex items-center justify-between
                          text-card-foreground font-semibold">
        <span>All pages ({pages.length})</span>
        <ChevronRight size={18} className="text-muted-foreground transition-transform
                                           group-open:rotate-90" />
      </summary>

      <div className="px-6 pb-6 space-y-6">
        {groups.map(([label, items]) =>
          items.length === 0 ? null : (
            <div key={label}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{label}</h3>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {items.map(page => (
                  <Link
                    key={page.page_id}
                    href={`/courses/${term}/${courseSlug}/${page.url}`}
                    className="flex items-center justify-between px-3 py-2 rounded-md
                               border border-border hover:bg-muted/50 transition-colors group/item"
                  >
                    <span className="text-sm text-card-foreground truncate pr-2">{page.title}</span>
                    <ChevronRight
                      size={14}
                      className="flex-shrink-0 text-muted-foreground
                                 group-hover/item:text-primary transition-colors"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </details>
  );
}
