import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ScrollText, Calculator, LucideIcon } from 'lucide-react';

interface QuickLink {
    title: string;
    href: string;
    icon: LucideIcon;
    isPrimary?: boolean;
}

export default function QuickLinks() {
    const links: QuickLink[] = [
        {
            title: 'Notes and Assignments',
            href: './notes',
            icon: FileText,
            isPrimary: true,
        },
        {
            title: 'Syllabus',
            href: './syllabus',
            icon: ScrollText,
        },
        {
            title: 'Resources',
            href: '/resources',
            icon: Calculator,
        },
    ];

    const PrimaryIcon = links[0].icon;

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8 w-full">
            {/* Primary Link */}
            <a
                href={links[0].href}
                className="w-full md:w-1/2 block no-underline group"
            >
                <Card className="bg-primary hover:bg-primary/90 active:bg-primary/95 transition-colors duration-150">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-center gap-3 min-h-[3.5rem]">
                            <PrimaryIcon
                                className="h-6 w-6 text-primary-foreground shrink-0"
                            />
                            <h3 className="text-lg font-medium text-primary-foreground m-0">
                                {links[0].title}
                            </h3>
                        </div>
                    </CardContent>
                </Card>
            </a>

            {/* Secondary Links Container */}
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-1/2">
                {links.slice(1).map((link) => {
                    const Icon = link.icon;
                    return (
                        <a
                            key={link.title}
                            href={link.href}
                            className="w-full md:w-1/2 block no-underline group"
                        >
                            <Card className="hover:bg-accent active:bg-accent/90 transition-colors duration-150">
                                <CardContent className="p-0">
                                    <div className="flex items-center justify-center gap-3 min-h-[3.5rem]">
                                        <Icon
                                            className="h-6 w-6 text-primary group-hover:text-primary/80 shrink-0"
                                        />
                                        <h3 className="text-base font-medium text-foreground m-0">
                                            {link.title}
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}