// src/app/courses/[term]/[courseSlug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { getCourseWithPages } from '@/lib/courses';
import { type CanvasPageSummary } from '@/lib/canvas-api';
import { familyCode, getCourseFamily, courseTitle } from '@/lib/families';
import { prepareCanvasHtml } from '@/lib/canvas-html';
import { getPublishedFiles, getPublishedSyllabus } from '@/lib/published-files';

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

  const { lookup } = await getPublishedFiles();
  const family = await getCourseFamily(familyCode(course.code));
  const title = courseTitle(course.name, family?.name ?? course.name);

  // The syllabus link was hidden whenever Canvas held no syllabus — which is
  // every recent course, since CLC publishes through Simple Syllabus. Show it
  // when either source has content. Next's data cache makes this fetch free:
  // the syllabus route asks for the same URL and gets the cached response.
  const hasSyllabus =
    course.hasSyllabus || (await getPublishedSyllabus(course.id)) !== null;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Header. The course number leads — it is how students name a course —
            and the metadata sits on one quiet line rather than in a box. */}
        <header className="pt-12 sm:pt-16 pb-8">
          <Link
            href={`/teaching/${familyCode(course.code).toLowerCase()}`}
            className="inline-flex items-center text-sm text-muted-foreground
                       hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={15} className="mr-1.5" />
            All terms of this course
          </Link>

          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-brass">
            {course.code}
          </p>
          <h1 className="font-serif font-semibold text-[clamp(1.9rem,4.5vw,2.75rem)]
                         leading-[1.08] tracking-[-0.02em] mt-3 text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground mt-4 tabular-nums">
            {course.term?.name}
            {' · '}
            {course.pages.length} {course.pages.length === 1 ? 'page' : 'pages'}
            {hasSyllabus && (
              <>
                {' · '}
                <Link
                  href={`/courses/${term}/${courseSlug}/syllabus`}
                  className="text-primary hover:underline underline-offset-2"
                >
                  Syllabus
                </Link>
              </>
            )}
          </p>
        </header>

        {/* Notes and Assignments Content */}
        {course.notesPage ? (
          <div className="border-t border-foreground/15 py-8">
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
                  },
                  lookup
                ),
              }}
            />
          </div>
        ) : (
          <div className="border-t border-foreground/15 py-8">
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
    <details className="border-t border-foreground/15 group mb-10" open={!sequential.length}>
      <summary className="cursor-pointer select-none py-6 flex items-center justify-between
                          font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground
                          hover:text-foreground transition-colors">
        <span>All pages ({pages.length})</span>
        <ChevronRight size={16} className="transition-transform group-open:rotate-90" />
      </summary>

      <div className="pb-8 space-y-6">
        {groups.map(([label, items]) =>
          items.length === 0 ? null : (
            <div key={label}>
              <h3 className="font-mono text-[10px] tracking-[0.14em] uppercase
                             text-muted-foreground mb-2.5">{label}</h3>
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
