// src/app/courses/[term]/[courseSlug]/syllabus/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import { getCourseBySlug, canvasCourseUrl } from '@/lib/courses';
import { getCourse } from '@/lib/canvas-api';
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
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps) {
  const { term, courseSlug } = await params;
  const course = await getCourseBySlug(term, courseSlug);

  if (!course) {
    return { title: 'Syllabus Not Found' };
  }

  return {
    title: `Syllabus - ${course.name}`,
    description: `Syllabus for ${course.code}`,
  };
}

export default async function SyllabusPage({ params }: PageProps) {
  const { term, courseSlug } = await params;
  const course = await getCourseBySlug(term, courseSlug);

  if (!course) {
    notFound();
  }

  // Fetch full course with syllabus
  const fullCourse = await getCourse(course.id);
  // Canvas returns an empty string rather than null when there is no syllabus,
  // which is the norm: CLC publishes through Simple Syllabus, so syllabus_body
  // is empty for every recent course. Fall back to the copy captured from
  // there, which the archive publishes.
  const canvasSyllabus = fullCourse.syllabus_body?.trim() ? fullCourse.syllabus_body : null;
  const publishedSyllabus = canvasSyllabus ? null : await getPublishedSyllabus(course.id);
  const syllabusHtml = canvasSyllabus ?? publishedSyllabus;
  const canvasUrl = canvasCourseUrl(course.id);
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
              <h1 className="text-2xl font-bold text-card-foreground">Syllabus</h1>
              <p className="text-muted-foreground">{course.name} - {course.term?.name}</p>
            </div>
          </div>
        </div>

        {/* Syllabus Content */}
        <div className="pb-8">
          {syllabusHtml ? (
            <div
              className="prose prose-slate dark:prose-invert max-w-none
                         prose-headings:text-card-foreground
                         prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                         prose-table:border-collapse prose-td:border prose-td:border-border prose-td:p-2
                         prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted/50
                         prose-ul:list-disc prose-ol:list-decimal"
              dangerouslySetInnerHTML={{ __html: prepareCanvasHtml(syllabusHtml, undefined, lookup) }}
            />
          ) : (
            <div className="text-muted-foreground space-y-3">
              <p>
                This syllabus isn&apos;t published through Canvas&apos;s own syllabus field, so it
                can&apos;t be mirrored here. CLC distributes syllabi through Simple Syllabus, which
                lives outside the Canvas API.
              </p>
              {canvasUrl && (
                <p>
                  <a
                    href={`${canvasUrl}/assignments/syllabus`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline font-medium"
                  >
                    Open the syllabus in Canvas
                    <ExternalLink size={14} className="ml-1.5" />
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
