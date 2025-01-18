import { DayContent } from '@/types/notes';

export async function getCourseContent(term: string, courseId: string): Promise<Record<string, DayContent>> {
    try {
        console.log(`Attempting to load content for ${term}/${courseId}`);
        
        const contentModule = await import(`@/data/course-content/${term}/${courseId}`);
        return contentModule.getCourseContent();
    } catch (error) {
        console.error(`Error loading content for ${term}/${courseId}:`, error);
        return {};
    }
} 