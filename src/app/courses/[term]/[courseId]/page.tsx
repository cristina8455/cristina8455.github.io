import { currentCourses, currentTerm } from '@/data/courses';
import CourseContent from '@/components/courses/CourseContent';
import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';

export const dynamic = 'force-static';

// Define the shape of our params
type PageParams = {
    term: string;
    courseId: string;
};

// Make the props type explicitly use Promise
type Props = {
    params: Promise<PageParams>;
};

export async function generateStaticParams(): Promise<PageParams[]> {
    const termSlug = currentTerm.toLowerCase().replace(' ', '-');
    return currentCourses.map((course) => ({
        term: termSlug,
        courseId: course.href
    }));
}

export default async function CoursePage({ params }: Props) {
    // Resolve the params
    const resolvedParams = await params;
    const { term, courseId } = resolvedParams;

    const course = currentCourses.find(c => c.href === courseId);
    if (!course) {
        return <div>Course not found</div>;
    }

    try {
        const contentPath = path.join(process.cwd(), 'src/content/courses', term, courseId, 'index.md');
        const content = await fs.readFile(contentPath, 'utf8');
        const htmlContent = marked.parse(content, { async: false }) as string;

        return <CourseContent courseData={{ ...course, content: htmlContent }} />;
    } catch (error) {
        console.error('Error loading course content:', error);
        return <div>Error loading course content</div>;
    }
}