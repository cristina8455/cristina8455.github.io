// src/components/layout/CanvasLayout.tsx
import { ThemeToggle } from '@/components/theme/theme-toggle';

interface CanvasLayoutProps {
    children: React.ReactNode;
}

export default function CanvasLayout({ children }: CanvasLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card border-b border-border">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex justify-end items-center">
                        <ThemeToggle />
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    );
}