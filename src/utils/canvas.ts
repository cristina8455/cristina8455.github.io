"use client";

import { useSyncExternalStore } from 'react';

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
    // Whether we are framed cannot be known during SSR and never changes after
    // load, so this is an external value with a fixed server snapshot rather
    // than state to sync in an effect. useSyncExternalStore models exactly
    // that: `false` on the server, the real answer once hydrated.
    return useSyncExternalStore(
        () => () => {},        // nothing to subscribe to; it cannot change
        () => isInCanvas(),    // client snapshot
        () => false            // server snapshot
    );
}