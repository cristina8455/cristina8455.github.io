// src/app/courses/[term]/[courseId]/page.tsx
import { currentCourses } from '@/data/courses';
import CourseContent from '@/components/courses/CourseContent';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export async function generateStaticParams() {
    return currentCourses.map((course) => ({
        term: '2025-spring',
        courseId: course.href.split('/').pop()
    }));
}

interface Props {
    params: {
        courseId: string;
    }
}

export default async function CoursePage({ params }: Props) {
    const course = currentCourses.find(c =>
        c.href.split('/').pop() === params.courseId
    );

    if (!course) {
        return <div>Course not found</div>;
    }

    const contentPath = path.join(process.cwd(), `src/content/courses/2025-spring/${params.courseId}/index.md`);
    const content = fs.readFileSync(contentPath, 'utf8');
    const htmlContent = marked(content);

    const courseData = {
        ...course,
        content: htmlContent,
    };

    return <CourseContent courseData={courseData} />;
}