import { SyncProvider, ContentItem, CanvasPage, CanvasAPIError } from '../types';

export class CanvasProvider implements SyncProvider {
    private baseUrl: string;
    private token: string;

    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash if present
        this.token = token;
    }

    private async fetchFromCanvas(endpoint: string): Promise<Response> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new CanvasAPIError(
                `Canvas API error: ${response.status} ${response.statusText}`,
                endpoint
            );
        }

        return response;
    }

    async getCoursePage(courseId: string, pageId: string): Promise<CanvasPage> {
        try {
            const response = await this.fetchFromCanvas(
                `/api/v1/courses/${courseId}/pages/${pageId}`
            );
            return await response.json();
        } catch (error: unknown) {
            if (error instanceof CanvasAPIError) {
                throw error;
            }
            // Handle unknown errors with a type check
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new CanvasAPIError(
                `Failed to fetch page ${pageId} from course ${courseId}: ${errorMessage}`,
                pageId
            );
        }
    }

    async listCoursePages(courseId: string): Promise<CanvasPage[]> {
        try {
            const response = await this.fetchFromCanvas(
                `/api/v1/courses/${courseId}/pages`
            );
            return await response.json();
        } catch (error: unknown) {
            if (error instanceof CanvasAPIError) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new CanvasAPIError(
                `Failed to list pages for course ${courseId}: ${errorMessage}`,
                courseId
            );
        }
    }

    // Implement SyncProvider interface
    async read(path: string): Promise<ContentItem> {
        // path format: courses/{courseId}/pages/{pageId}
        const [, courseId, , pageId] = path.split('/');
        const page = await this.getCoursePage(courseId, pageId);

        return {
            id: page.page_id,
            title: page.title,
            content: page.body,
            lastModified: new Date(page.updated_at),
            source: 'canvas',
            path: path,
            courseId: courseId,
            metadata: {
                published: page.published,
                hideFromStudents: page.hide_from_students,
                frontPage: page.front_page,
            },
        };
    }
}