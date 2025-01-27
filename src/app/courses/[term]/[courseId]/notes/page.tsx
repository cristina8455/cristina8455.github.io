import { NotesPageClient } from './NotesPageClient';
import { currentCourses } from '@/data/courses';
import { getCourseConfig } from '@/lib/course-content';

export const dynamic = 'force-static';

interface PageProps {
    params: Promise<{
        term: string;
        courseId: string;
    }>;
}

export async function generateStaticParams() {
    return currentCourses.map((course) => ({
        term: course.term.slug,
        courseId: course.href,
    }));
}

export default async function NotesPage({ params }: PageProps) {
    // Await the params first
    const resolvedParams = await params;

    const course = currentCourses.find(
        c => c.term.slug === resolvedParams.term && c.href === resolvedParams.courseId
    );

    if (!course) {
        console.error('Course not found:', resolvedParams);
        return <div>Course not found</div>;
    }

    // Get course-specific config (including weeks)
    const courseConfig = await getCourseConfig(resolvedParams.term, resolvedParams.courseId);

    return (
        <NotesPageClient
            term={course.term.slug}
            courseId={course.href}
            courseName={course.title}
            courseCode={course.code}
            courseWeeks={courseConfig.weeks}
        />
    );
} 