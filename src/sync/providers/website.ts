import { promises as fs } from 'fs';
import path from 'path';
import { SyncProvider, ContentItem } from '../types';

// Define types for frontmatter and parsed content
type FrontMatterValue = string | number | boolean | null;
type FrontMatterData = Record<string, FrontMatterValue>;

interface ParsedContent {
    metadata: FrontMatterData;
    content: string;
}

export class WebsiteProvider implements SyncProvider {
    private contentRoot: string;

    constructor(contentRoot: string) {
        this.contentRoot = contentRoot;
    }

    async read(filePath: string): Promise<ContentItem> {
        const fullPath = path.join(this.contentRoot, filePath);
        const content = await fs.readFile(fullPath, 'utf-8');

        // Parse front matter and content
        const { metadata, content: bodyContent } = this.parseMarkdownWithFrontMatter(content);

        return {
            id: path.basename(filePath, '.md'),
            title: metadata.title as string,
            content: bodyContent,
            lastModified: new Date(metadata.lastModified as string),
            source: 'website',
            path: filePath,
            courseId: metadata.courseId as string,
            metadata
        };
    }

    async write(item: ContentItem): Promise<void> {
        const fullPath = path.join(this.contentRoot, item.path);
        const directory = path.dirname(fullPath);

        // Ensure directory exists
        await fs.mkdir(directory, { recursive: true });

        // Create front matter with null for undefined values
        const frontMatter: FrontMatterData = {
            title: item.title,
            lastModified: item.lastModified.toISOString(),
            courseId: item.courseId ?? null,
            canvasId: item.id,
            ...(item.metadata || {})
        };

        // Combine front matter and content
        const fileContent = this.createMarkdownWithFrontMatter(frontMatter, item.content);

        // Write to file
        await fs.writeFile(fullPath, fileContent, 'utf-8');
    }

    private parseMarkdownWithFrontMatter(content: string): ParsedContent {
        const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);

        if (!match) {
            return {
                metadata: {},
                content: content
            };
        }

        const [, frontMatter, bodyContent] = match;
        const metadata = this.parseFrontMatter(frontMatter);

        return {
            metadata,
            content: bodyContent.trim()
        };
    }

    private parseFrontMatter(frontMatter: string): FrontMatterData {
        const metadata: FrontMatterData = {};
        const lines = frontMatter.split('\n');

        for (const line of lines) {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
                const value = valueParts.join(':').trim();
                const trimmedKey = key.trim();
                // Try to parse booleans
                if (value === 'true') metadata[trimmedKey] = true;
                else if (value === 'false') metadata[trimmedKey] = false;
                // Try to parse numbers
                else if (!isNaN(Number(value))) metadata[trimmedKey] = Number(value);
                // Handle null values
                else if (value === 'null' || value === '') metadata[trimmedKey] = null;
                // Otherwise keep as string
                else metadata[trimmedKey] = value;
            }
        }

        return metadata;
    }

    private createMarkdownWithFrontMatter(metadata: FrontMatterData, content: string): string {
        const frontMatter = Object.entries(metadata)
            .map(([key, value]) => `${key}: ${value === null ? '' : value}`)
            .join('\n');

        return `---\n${frontMatter}\n---\n\n${content}`;
    }
}