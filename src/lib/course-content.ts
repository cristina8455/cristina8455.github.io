import type { DayContent, WeekRange } from '@/types/notes';

export async function getCourseConfig(term: string, courseId: string) {
    try {
        // Log the path we're trying to import
        console.log('Importing from:', `@/data/course-content/${term}/${courseId}`);

        const courseModule = await import(`@/data/course-content/${term}/${courseId}`);

        // Log what we got from the import
        console.log('Loaded course module:', {
            weeks: courseModule.COURSE_WEEKS,
            content: courseModule.courseContent
        });

        return {
            weeks: courseModule.COURSE_WEEKS as WeekRange[],
            content: courseModule.courseContent as Record<string, DayContent>
        };
    } catch (error) {
        console.error('Error loading course config:', error);
        throw error;
    }
}

export async function getCourseContent(term: string, courseId: string) {
    const config = await getCourseConfig(term, courseId);
    console.log('getCourseContent returning:', config.content);
    return config.content;
} 