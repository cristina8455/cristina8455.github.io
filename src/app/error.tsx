'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Route-level error boundary.
 *
 * Course content is fetched from Canvas at render time, so an outage or an
 * expired token surfaces here. Say that plainly rather than showing a bare
 * 500 — and point people at Canvas, which is where the content actually is.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-card rounded-lg border border-border shadow-sm p-8 max-w-lg w-full">
        <div className="flex items-start">
          <AlertCircle size={22} className="text-amber-600 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-card-foreground mb-2">
              This page couldn&apos;t load
            </h1>
            <p className="text-muted-foreground text-sm mb-4">
              Course content is pulled from Canvas, and that request didn&apos;t come back. This is
              usually temporary — trying again often works. In the meantime, the material is always
              available directly in Canvas.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg
                           hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                <RefreshCw size={15} className="mr-2" />
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-border rounded-lg
                           hover:bg-muted/50 transition-colors text-sm font-medium text-card-foreground"
              >
                Back to home
              </Link>
            </div>

            {error.digest && (
              <p className="text-xs text-muted-foreground/70 mt-5 font-mono">
                Reference: {error.digest}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
