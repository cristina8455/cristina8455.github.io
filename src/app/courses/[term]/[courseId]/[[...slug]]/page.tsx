// src/app/courses/[term]/[courseId]/[[...slug]]/page.tsx
import { currentCourses } from '@/data/courses';
import CourseContent from '@/components/courses/CourseContent';
import { processMarkdown } from '@/utils/markdown';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-static';

type PageParams = {
    term: string;
    courseId: string;
    slug?: string[];
};

type Props = {
    params: Promise<PageParams>;  // Changed back to Promise
};

async function getCourseSyncedPages(term: string, courseId: string): Promise<string[]> {
    const pagesPath = path.join(process.cwd(), 'src/content/courses', term, courseId, 'pages');
    try {
        const files = await fs.readdir(pagesPath);
        return files
            .filter(file => file.endsWith('.md'))
            .map(file => file.replace(/\.md$/, ''));
    } catch {
        return [];
    }
}

export async function generateStaticParams(): Promise<PageParams[]> {
    const params: PageParams[] = [];

    // Add base course pages (index.md)
    const baseParams = currentCourses.map((course) => ({
        term: course.term.slug,
        courseId: course.href,
        slug: undefined
    }));

    console.log('Generating static paths for base courses:', baseParams);
    params.push(...baseParams);

    // Add synced pages for each course
    for (const course of currentCourses) {
        const syncedPages = await getCourseSyncedPages(course.term.slug, course.href);
        console.log(`Synced pages for ${course.href}:`, syncedPages);

        for (const page of syncedPages) {
            params.push({
                term: course.term.slug,
                courseId: course.href,
                slug: ['pages', page]
            });
        }
    }

    console.log('Final params:', params);
    return params;
}

async function getPageContent(term: string, courseId: string, slug?: string[]): Promise<string> {
    let contentPath;

    if (!slug || slug.length === 0) {
        contentPath = path.join(process.cwd(), 'src/content/courses', term, courseId, 'index.md');
    } else {
        const cleanSlug = slug[0] === 'pages' ? slug.slice(1) : slug;
        contentPath = path.join(process.cwd(), 'src/content/courses', term, courseId, 'pages', `${cleanSlug.join('/')}.md`);
    }

    try {
        const content = await fs.readFile(contentPath, 'utf8');
        const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);

        if (match) {
            const [, , bodyContent] = match;
            return await processMarkdown(bodyContent.trim());
        }

        return await processMarkdown(content);
    } catch (error) {
        console.error(`Error loading content from ${contentPath}:`, error);
        throw error;
    }
}

export default async function CoursePage({ params }: Props) {
    // Resolve the params
    const resolvedParams = await params;
    const { term, courseId, slug } = resolvedParams;

    const course = currentCourses.find(c => c.href === courseId);
    if (!course) {
        return <div>Course not found</div>;
    }

    try {
        const htmlContent = await getPageContent(term, courseId, slug);
        return (
            <CourseContent
                courseData={{ ...course, content: htmlContent }}
                courseSlug={`${term}/${courseId}`}
            />
        );
    } catch (error) {
        console.error('Error loading course content:', error);
        return <div>Error loading course content</div>;
    }
}