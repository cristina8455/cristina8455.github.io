// src/components/layout/RootLayout.tsx
'use client';

import { useIsInCanvas } from '@/utils/canvas';
import Header from './Header';
import CanvasLayout from './CanvasLayout';

interface RootLayoutProps {
    children: React.ReactNode;
    /**
     * Rendered below the main content on the standalone site. Passed in from
     * the server layout so it can carry server-rendered content; suppressed
     * when embedded in Canvas, where the chrome would be redundant.
     */
    footer?: React.ReactNode;
}

export default function RootLayout({ children, footer }: RootLayoutProps) {
    const inCanvas = useIsInCanvas();

    if (inCanvas) {
        return <CanvasLayout>{children}</CanvasLayout>;
    }

    return (
        <>
            <Header />
            <main>{children}</main>
            {footer}
        </>
    );
}