// src/components/layout/RootLayout.tsx
'use client';

import { useIsInCanvas } from '@/utils/canvas';
import Header from './Header';
import CanvasLayout from './CanvasLayout';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const inCanvas = useIsInCanvas();

    if (inCanvas) {
        return <CanvasLayout>{children}</CanvasLayout>;
    }

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-6">
                {children}
            </main>
        </>
    );
}