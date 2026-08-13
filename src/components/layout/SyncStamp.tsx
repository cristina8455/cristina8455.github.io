/**
 * Server component. Renders when the page was last generated from Canvas.
 *
 * This is the smallest possible fix for the failure mode that took the site
 * down for months: ISR keeps serving the last good render forever, so a stale
 * page is visually identical to a fresh one. Showing the date makes staleness
 * something a reader — or the instructor — can actually notice.
 *
 * Timezone is pinned to the college's so the date doesn't drift by one day
 * depending on where the render happened.
 */

const formatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'America/Chicago',
});

export default function SyncStamp() {
  const now = new Date();

  return (
    <footer className="border-t border-border/40 mt-12">
      <div className="container mx-auto px-4 py-5 flex flex-wrap gap-x-4 gap-y-1 items-center
                      justify-between text-xs text-muted-foreground">
        <p>
          Course content synced from Canvas ·{' '}
          <time dateTime={now.toISOString()}>{formatter.format(now)}</time>
        </p>
        <p>
          Always current in{' '}
          <a
            href="https://clcillinois.instructure.com"
            className="hover:text-primary transition-colors underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Canvas
          </a>
        </p>
      </div>
    </footer>
  );
}
