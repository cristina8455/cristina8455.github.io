// src/app/courses/[term]/[courseSlug]/syllabus/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { getCourseBySlug } from '@/lib/courses';
import { getCourse } from '@/lib/canvas-api';

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
  const syllabusHtml = fullCourse.syllabus_body;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
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
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">Syllabus</h1>
              <p className="text-muted-foreground">{course.name} - {course.term?.name}</p>
            </div>
          </div>
        </div>

        {/* Syllabus Content */}
        <div className="bg-card rounded-lg shadow-sm p-6">
          {syllabusHtml ? (
            <div
              className="prose prose-slate dark:prose-invert max-w-none
                         prose-headings:text-card-foreground
                         prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                         prose-table:border-collapse prose-td:border prose-td:border-border prose-td:p-2
                         prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted/50
                         prose-ul:list-disc prose-ol:list-decimal"
              dangerouslySetInnerHTML={{ __html: syllabusHtml }}
            />
          ) : (
            <p className="text-muted-foreground">No syllabus available for this course.</p>
          )}
        </div>
      </main>
    </div>
  );
}
