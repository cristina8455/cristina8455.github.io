import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Markdown from 'markdown-to-jsx';
import { Card } from '@/components/ui/card';

type PageProps = {
    params: Promise<{ courseId: string; term: string }>;
};

export function generateStaticParams() {
    return [
        { term: 'spring-2025', courseId: 'mth122' },
        { term: 'spring-2025', courseId: 'mth144-005' },
        { term: 'spring-2025', courseId: 'mth144-202' }
    ];
}

async function getSyllabusContent(courseId: string) {
    try {
        const filePath = path.join(process.cwd(), 'src/content/syllabi', `${courseId}.md`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { content } = matter(fileContent);
        return content;
    } catch {
        return null;
    }
}

export default async function SyllabusPage(props: PageProps) {
    const params = await props.params;
    const content = await getSyllabusContent(params.courseId);

    if (!content) {
        notFound();
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 space-y-6">
            <Card className="p-8 shadow-md">
                <article className="prose prose-slate dark:prose-invert max-w-none">
                    <Markdown
                        options={{
                            overrides: {
                                h1: {
                                    component: ({ children }) => (
                                        <h1 className="text-4xl font-bold mb-2 text-primary bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                            {children}
                                        </h1>
                                    )
                                },
                                h2: {
                                    component: ({ children }) => (
                                        <h2 className="text-2xl font-semibold mt-12 mb-6 text-primary/90 border-b pb-2 border-border/50">
                                            {children}
                                        </h2>
                                    )
                                },
                                h3: {
                                    component: ({ children }) => (
                                        <h3 className="text-xl font-medium mt-8 mb-4 text-primary/80">{children}</h3>
                                    )
                                },
                                p: {
                                    component: ({ children }) => (
                                        <p className="mb-6 leading-7 text-muted-foreground">{children}</p>
                                    )
                                },
                                ul: {
                                    component: ({ children }) => (
                                        <ul className="my-6 ml-6 list-none space-y-2">
                                            {children}
                                        </ul>
                                    )
                                },
                                li: {
                                    component: ({ children }) => (
                                        <li className="relative pl-6 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary">
                                            {children}
                                        </li>
                                    )
                                },
                                table: {
                                    component: ({ children }) => (
                                        <div className="my-6 w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                                            <table className="w-full border-collapse text-sm">
                                                {children}
                                            </table>
                                        </div>
                                    )
                                },
                                th: {
                                    component: ({ children }) => (
                                        <th className="border-b border-border bg-muted/50 px-6 py-3.5 text-left font-semibold text-primary/90 dark:text-primary-foreground/90">
                                            {children}
                                        </th>
                                    )
                                },
                                td: {
                                    component: ({ children }) => (
                                        <td className="border-b border-border/50 px-6 py-4 text-muted-foreground transition-colors hover:bg-muted/50 [&[align=center]]:text-center [&[align=right]]:text-right">
                                            {children}
                                        </td>
                                    )
                                },
                                tbody: {
                                    component: ({ children }) => (
                                        <tbody className="divide-y divide-border">
                                            {children}
                                        </tbody>
                                    )
                                },
                                strong: {
                                    component: ({ children }) => (
                                        <strong className="font-semibold text-primary/90">
                                            {children}
                                        </strong>
                                    )
                                },
                                a: {
                                    component: ({ children, href }) => (
                                        <a
                                            href={href}
                                            className="text-primary hover:text-primary/80 underline-offset-4 decoration-primary/30 transition-colors"
                                        >
                                            {children}
                                        </a>
                                    )
                                },
                                blockquote: {
                                    component: ({ children }) => (
                                        <blockquote className="mt-6 border-l-4 border-primary/30 pl-6 italic text-muted-foreground bg-muted/30 py-4 rounded-r">
                                            {children}
                                        </blockquote>
                                    )
                                }
                            }
                        }}
                    >
                        {content}
                    </Markdown>
                </article>
            </Card>
        </div>
    );
} 