// src/app/courses/[term]/[courseSlug]/[page]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { getCoursePageBySlug } from '@/lib/courses';
import { prepareCanvasHtml } from '@/lib/canvas-html';
import { getPublishedFiles } from '@/lib/published-files';

// ISR: revalidate every 24 hours
export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    term: string;
    courseSlug: string;
    page: string;
  }>;
}

// Dynamic routes - no static generation at build time
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps) {
  const { term, courseSlug, page: pageSlug } = await params;
  const result = await getCoursePageBySlug(term, courseSlug, pageSlug);

  if (!result) {
    return { title: 'Page Not Found' };
  }

  return {
    title: `${result.page.title} - ${result.course.code}`,
    description: `${result.page.title} for ${result.course.name}`,
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { term, courseSlug, page: pageSlug } = await params;
  const result = await getCoursePageBySlug(term, courseSlug, pageSlug);

  if (!result) {
    notFound();
  }

  const { course, page } = result;
  const { lookup } = await getPublishedFiles();

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-10">
        {/* Back Link */}
        <Link
          href={`/courses/${term}/${courseSlug}`}
          className="inline-flex items-center text-muted-foreground hover:text-primary
                     transition-colors mb-4 text-sm"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to {course.code}
        </Link>

        {/* Header */}
        <div className="pb-8 mb-8 border-b border-foreground/15">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">{page.title}</h1>
              <p className="text-muted-foreground">{course.name} - {course.term?.name}</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="pb-8">
          {page.body ? (
            <div
              className="prose prose-slate dark:prose-invert max-w-none
                         prose-headings:text-card-foreground
                         prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                         prose-table:border-collapse prose-td:border prose-td:border-border prose-td:p-2
                         prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted/50
                         prose-img:rounded-lg prose-img:shadow-md
                         prose-ul:list-disc prose-ol:list-decimal"
              dangerouslySetInnerHTML={{ __html: prepareCanvasHtml(page.body, undefined, lookup) }}
            />
          ) : (
            <p className="text-muted-foreground">This page has no content.</p>
          )}
        </div>
      </main>
    </div>
  );
}
