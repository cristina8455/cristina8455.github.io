import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';

export async function processMarkdown(content: string): Promise<string> {
    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype, {
            allowDangerousHtml: true
        })
        .use(rehypeKatex)
        .use(rehypeStringify, {
            allowDangerousHtml: true
        })
        .process(content);

    return processedContent.toString();
}