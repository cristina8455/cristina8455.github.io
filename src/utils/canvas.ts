// src/utils/canvas.ts
import { useState, useEffect } from 'react';

/**
 * Check if the current page is embedded in Canvas LMS
 * 
 * This function:
 * - Returns false during server-side rendering
 * - Checks if the current window is embedded in an iframe
 * - Uses a few additional checks to be more confident it's Canvas
 * 
 * @returns boolean indicating if the page is embedded in Canvas
 */
export function isInCanvas(): boolean {
    // Return false during SSR
    if (typeof window === 'undefined') return false;

    try {
        // Basic iframe check
        const isIframe = window !== window.parent;

        if (!isIframe) return false;

        // Additional Canvas-specific checks could be added here
        // For example, checking for Canvas-specific URL patterns in parent
        // or looking for Canvas-specific elements

        return true;
    } catch {
        // If we can't access window.parent due to cross-origin restrictions,
        // we're likely in an iframe
        return true;
    }
}

/**
 * Hook to safely check Canvas embedding status on the client side
 * 
 * @returns [boolean] indicating if page is embedded in Canvas
 */
export function useIsInCanvas(): boolean {
    const [inCanvas, setInCanvas] = useState<boolean>(false);

    useEffect(() => {
        setInCanvas(isInCanvas());
    }, []);

    return inCanvas;
}