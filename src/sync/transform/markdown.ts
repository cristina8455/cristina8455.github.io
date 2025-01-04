import TurndownService from 'turndown';
import { ContentTransformError } from '../types';

export class MarkdownTransformer {
    private turndownService: TurndownService;

    constructor() {
        this.turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            emDelimiter: '_',
            bulletListMarker: '-'
        });

        // Configure turndown rules
        this.configureTurndownRules();
    }

    private configureTurndownRules(): void {
        // Process lists
        this.turndownService.addRule('lists', {
            filter: ['ul', 'ol'],
            replacement: function (content, node) {
                // Skip nested lists (they'll be handled by their parent)
                if (node.parentNode && node.parentNode.nodeName === 'LI') {
                    return content;
                }

                const listItems = Array.from(node.children)
                    .map(li => {
                        // Get the text content and any nested lists
                        const text = li.firstChild?.textContent?.trim() || '';
                        const nestedList = li.querySelector('ul,ol');
                        const nestedContent = nestedList ?
                            `\n${Array.from(nestedList.children)
                                .map(nested => `    - ${nested.textContent?.trim() || ''}`)
                                .join('\n')}` : '';

                        return `- ${text}${nestedContent}`;
                    })
                    .join('\n');

                return `\n\n${listItems}\n\n`;
            }
        });

        // Convert Canvas equation images to LaTeX
        this.turndownService.addRule('latexImages', {
            filter: function (node: Node): boolean {
                if (node.nodeName !== 'IMG') return false;
                return ((node as Element).getAttribute('alt') || '').startsWith('LaTeX:');
            },
            replacement: function (content: string, node: Node): string {
                const alt = (node as Element).getAttribute('alt') || '';
                const latex = alt.replace('LaTeX:', '').trim();
                return `$${latex}$`;
            }
        });
    }

    async htmlToMarkdown(html: string): Promise<string> {
        try {
            // Basic sanitization
            const sanitizedHtml = this.sanitizeHtml(html);

            // Convert to markdown
            let markdown = this.turndownService.turndown(sanitizedHtml);

            // Post-process markdown
            markdown = this.postProcessMarkdown(markdown);

            return markdown;
        } catch (error) {
            throw new ContentTransformError(
                `Failed to convert HTML to Markdown: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    private sanitizeHtml(html: string): string {
        // Remove potentially problematic scripts
        return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    private postProcessMarkdown(markdown: string): string {
        return markdown
            // Ensure consistent newlines
            .replace(/\r\n/g, '\n')
            // Remove excessive blank lines
            .replace(/\n{3,}/g, '\n\n')
            // Clean up any remaining double list markers
            .replace(/^-\s+[*-]\s+/gm, '- ')
            // Ensure trailing newline
            .trim() + '\n';
    }
}