"use client";

import React from 'react';
import { Home } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

interface CanvasLayoutProps {
    children: React.ReactNode;
    courseSlug?: string; // e.g., "2025-spring/mth122"
}

export default function CanvasLayout({ children, courseSlug }: CanvasLayoutProps) {
    // Construct the course home URL
    const courseHomeUrl = courseSlug ? `/courses/${courseSlug}` : '/courses';

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card border-b border-border">
                <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
                    <a
                        href={courseHomeUrl}
                        className="flex items-center gap-2 text-base text-foreground/80 hover:text-foreground no-underline"
                    >
                        <Home className="h-5 w-5" />
                        <span>Course Home</span>
                    </a>
                    <ThemeToggle />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-4">
                {children}
            </main>
        </div>
    );
}