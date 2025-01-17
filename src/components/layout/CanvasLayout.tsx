"use client";

import React from 'react';
import { Home } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/theme-toggle';

interface CanvasLayoutProps {
    children: React.ReactNode;
}

export default function CanvasLayout({ children }: CanvasLayoutProps) {
    // Extract course slug from current URL
    const getCourseSlug = () => {
        if (typeof window === 'undefined') return '';
        const match = window.location.pathname.match(/\/courses\/([^/]+\/[^/]+)/);
        return match ? match[1] : '';
    };

    const courseHomeUrl = `/courses/${getCourseSlug()}`;

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card border-b border-border/40">
                <div className="max-w-4xl mx-auto px-4 h-11 flex items-center justify-between">
                    <a
                        href={courseHomeUrl}
                        className="flex items-center gap-2 text-base text-foreground/80 hover:text-foreground transition-colors"
                    >
                        <Home className="h-5 w-5" />
                        <span>Course Home</span>
                    </a>
                    <div className="hover:bg-accent/50 p-1 rounded-md transition-colors">
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-4">
                <div className="bg-card rounded-lg border border-border/40 shadow-sm">
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}