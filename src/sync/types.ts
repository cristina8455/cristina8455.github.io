// Types for Canvas content and sync operations

export type ContentSource = 'canvas' | 'website';

export interface ContentItem {
    id: string;
    title: string;
    content: string;
    lastModified: Date;
    source: ContentSource;
    path: string;
    courseId?: string;
    metadata?: Record<string, unknown>;
}

export interface SyncProvider {
    read: (path: string) => Promise<ContentItem>;
    write?: (item: ContentItem) => Promise<void>;
}

export interface CourseMapping {
    canvasId: string;
    term: string;     // e.g., 'spring-2025'
    courseCode: string; // e.g., 'mth-122'
}

export interface SyncOptions {
    dryRun?: boolean;
    contentTypes?: ('pages' | 'announcements' | 'files')[];
    courseIds?: string[];
    courseMappings?: CourseMapping[];
}

export interface CanvasPage {
    id: number;
    title: string;
    body: string;
    updated_at: string;
    editing_roles: string;
    page_id: string;
    published: boolean;
    hide_from_students: boolean;
    front_page: boolean;
}

export interface WebsitePage {
    path: string;
    content: string;
    metadata: {
        title: string;
        lastModified: string;
        courseId?: string;
        canvasId?: string;
    };
}

// Error types for better error handling
export class SyncError extends Error {
    constructor(
        message: string,
        public readonly source?: ContentSource,
        public readonly itemId?: string
    ) {
        super(message);
        this.name = 'SyncError';
    }
}

export class ContentTransformError extends SyncError {
    constructor(message: string, itemId?: string) {
        super(message, undefined, itemId);
        this.name = 'ContentTransformError';
    }
}

export class CanvasAPIError extends SyncError {
    constructor(message: string, itemId?: string) {
        super(message, 'canvas', itemId);
        this.name = 'CanvasAPIError';
    }
}