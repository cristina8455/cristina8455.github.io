import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Home } from 'lucide-react';

interface CanvasLayoutProps {
    children: React.ReactNode;
}

export default function CanvasLayout({ children }: CanvasLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Minimal header */}
            <header className="bg-card border-b border-border">
                <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground no-underline"
                    >
                        <Home className="h-4 w-4" />
                        <span>Course Home</span>
                    </Link>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main content with reduced padding */}
            <main className="max-w-4xl mx-auto px-4 py-4">
                {children}
            </main>
        </div>
    );
}