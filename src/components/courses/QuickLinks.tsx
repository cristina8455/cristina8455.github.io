"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ScrollText, Calculator, LucideIcon } from 'lucide-react';

interface QuickLinksProps {
    courseSlug: string;
}

interface QuickLink {
    title: string;
    href: string;
    Icon: LucideIcon;
    isPrimary?: boolean;
}

export default function QuickLinks({ courseSlug }: QuickLinksProps) {
    const links: QuickLink[] = [
        {
            title: 'Notes and Assignments',
            href: `/courses/${courseSlug}/notes`,
            Icon: FileText,
            isPrimary: true,
        },
        {
            title: 'Syllabus',
            href: `/courses/${courseSlug}/syllabus`,
            Icon: ScrollText,
        },
        {
            title: 'Resources',
            href: '/resources',  // Changed to static path
            Icon: Calculator,
        },
    ];

    const PrimaryIcon = links[0].Icon;

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Primary Link */}
            <a
                href={links[0].href}
                className="w-full md:w-1/2 block no-underline group"
            >
                <Card className="bg-primary hover:bg-primary/90 active:bg-primary/95 transition-colors duration-150">
                    <CardContent className="p-0">
                        <div className="flex items-center justify-center gap-3 min-h-[3.25rem]">
                            <PrimaryIcon className="h-5 w-5 text-primary-foreground shrink-0" />
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
                    const Icon = link.Icon;
                    return (
                        <a
                            key={link.title}
                            href={link.href}
                            className="w-full md:w-1/2 block no-underline group"
                        >
                            <Card className="hover:bg-accent active:bg-accent/90 transition-colors duration-150">
                                <CardContent className="p-0">
                                    <div className="flex items-center justify-center gap-3 min-h-[3.25rem]">
                                        <Icon className="h-5 w-5 text-primary group-hover:text-primary/80 shrink-0" />
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