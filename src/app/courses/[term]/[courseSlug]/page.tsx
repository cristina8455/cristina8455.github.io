// src/app/courses/[term]/[courseSlug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, FileText, ChevronRight } from 'lucide-react';
import { getCourseWithPages } from '@/lib/courses';

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

          {/* Quick Links */}
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
              dangerouslySetInnerHTML={{ __html: course.notesPage.body }}
            />
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow-sm p-6">
            <p className="text-muted-foreground">No course content available.</p>

            {/* Show available pages as fallback */}
            {course.pages.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Available Pages</h2>
                <div className="grid gap-2">
                  {course.pages.slice(0, 20).map(page => (
                    <Link
                      key={page.page_id}
                      href={`/courses/${term}/${courseSlug}/${page.url}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-border
                                 hover:bg-muted/50 transition-colors group"
                    >
                      <span className="text-card-foreground">{page.title}</span>
                      <ChevronRight
                        size={16}
                        className="text-muted-foreground group-hover:text-primary
                                   group-hover:translate-x-1 transition-all"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
