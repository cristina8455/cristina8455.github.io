import { CanvasProvider } from './providers/canvas';
import { WebsiteProvider } from './providers/website';
import { MarkdownTransformer } from './transform/markdown';
import { SyncOptions, CanvasAPIError, ContentTransformError } from './types';
import path from 'path';

export class CanvasSyncer {
    private canvasProvider: CanvasProvider;
    private websiteProvider: WebsiteProvider;
    private transformer: MarkdownTransformer;

    constructor(
        canvasBaseUrl: string,
        canvasToken: string,
        contentRoot: string
    ) {
        this.canvasProvider = new CanvasProvider(canvasBaseUrl, canvasToken);
        this.websiteProvider = new WebsiteProvider(contentRoot);
        this.transformer = new MarkdownTransformer();
    }

    async syncCoursePages(courseId: string, options: SyncOptions = {}): Promise<void> {
        try {
            console.log(`Starting sync for course ${courseId}...`);

            // Get all pages for the course
            const pages = await this.canvasProvider.listCoursePages(courseId);

            // Filter out unpublished pages
            const publishedPages = pages.filter(page => page.published);

            console.log(`Found ${publishedPages.length} published pages`);

            for (const page of publishedPages) {
                try {
                    // Get full page content
                    const fullPage = await this.canvasProvider.getCoursePage(courseId, page.page_id);

                    // Transform HTML to Markdown
                    const markdown = await this.transformer.htmlToMarkdown(fullPage.body);

                    // Generate file path for the page
                    const pagePath = this.generatePagePath(courseId, page.title, page.page_id, options);

                    // If dry run, just log what would be written
                    if (options.dryRun) {
                        console.log(`Would write page "${page.title}" to ${pagePath}`);
                        continue;
                    }

                    // Write to website content directory
                    await this.websiteProvider.write({
                        id: page.page_id,
                        title: page.title,
                        content: markdown,
                        lastModified: new Date(page.updated_at),
                        source: 'canvas',
                        path: pagePath,
                        courseId,
                        metadata: {
                            published: page.published,
                            frontPage: page.front_page,
                        }
                    });

                    console.log(`Successfully synced page "${page.title}"`);
                } catch (error) {
                    console.error(`Failed to sync page "${page.title}":`, error);
                    // Continue with other pages even if one fails
                }
            }
        } catch (error) {
            if (error instanceof CanvasAPIError) {
                throw new Error(`Canvas API error: ${error.message}`);
            }
            if (error instanceof ContentTransformError) {
                throw new Error(`Content transformation error: ${error.message}`);
            }
            throw error;
        }
    }

    private generatePagePath(courseId: string, title: string, pageId: string, options: SyncOptions): string {
        // Find course mapping
        const mapping = options.courseMappings?.find(m => m.canvasId === courseId);
        if (!mapping) {
            throw new Error(`No mapping found for course ID ${courseId}`);
        }

        // Convert title to URL-friendly slug
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        return path.join(
            'src',
            'content',
            'courses',
            mapping.term,
            mapping.courseCode,
            'pages',
            `${slug}.md`
        );
    }
}

// Function to run during build
export async function runBuildTimeSync(options: SyncOptions = {}): Promise<void> {
    const canvasBaseUrl = process.env.CANVAS_BASE_URL;
    const canvasToken = process.env.CANVAS_API_TOKEN;
    const courseIds = process.env.SYNC_COURSE_IDS?.split(',') || [];

    if (!canvasBaseUrl || !canvasToken) {
        throw new Error('Missing required environment variables for Canvas sync');
    }

    const syncer = new CanvasSyncer(
        canvasBaseUrl,
        canvasToken,
        process.cwd()
    );

    console.log('Starting Canvas content sync...');

    for (const courseId of courseIds) {
        try {
            await syncer.syncCoursePages(courseId.trim(), options);
        } catch (error) {
            console.error(`Failed to sync course ${courseId}:`, error);
        }
    }

    console.log('Canvas content sync completed');
}