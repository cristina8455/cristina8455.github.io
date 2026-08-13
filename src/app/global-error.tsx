'use client';

/**
 * Last-resort boundary for errors thrown in the root layout itself.
 *
 * This replaces the entire document, so it has to render its own <html> and
 * <body> and cannot rely on the app's providers, fonts, or Tailwind classes
 * being applied. Styles are inline for that reason.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
          background: '#fbfcfb',
          color: '#131a17',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          textAlign: 'center',
        }}
      >
        <main style={{ maxWidth: '32rem' }}>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 600, margin: '0 0 .6rem' }}>
            Something went wrong
          </h1>
          <p style={{ margin: '0 0 1.4rem', lineHeight: 1.6, color: '#39443e' }}>
            The site hit an unexpected error and couldn&apos;t render. Course material remains
            available in Canvas.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '.6rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              background: '#2e7d6f',
              color: '#fff',
              fontWeight: 500,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ fontSize: '.75rem', color: '#66736b', marginTop: '1.6rem' }}>
              Reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
