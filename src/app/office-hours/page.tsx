import Link from 'next/link';
import { officeHours, officeLabel, officeLocation, profile } from '@/lib/profile';

export const revalidate = 86400;

export const metadata = {
  title: 'Office Hours',
  description: `Office hours for ${officeHours.term}.`,
};

const updated = new Date(`${officeHours.updated}T12:00:00Z`);
const formatted = new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago',
}).format(updated);

/**
 * Office hours, from src/lib/profile.ts rather than scraped from Canvas.
 *
 * The date is the point. A schedule with no date cannot be told apart from a
 * stale one, which is precisely how the previous version failed: it showed
 * "check Canvas" all term while the hours were published, and looked exactly
 * like a term whose hours had not been posted yet.
 */
export default function OfficeHoursPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-5 sm:px-8">
        <header className="pt-12 sm:pt-16 pb-8">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-brass">
            {officeHours.term}
          </p>
          <h1 className="font-serif font-semibold text-[clamp(1.9rem,4.5vw,2.75rem)]
                         leading-[1.08] tracking-[-0.02em] mt-3 text-foreground">
            Office hours
          </h1>
        </header>

        <div className="border-t border-foreground/15 py-10
                        grid gap-x-14 gap-y-10 md:grid-cols-[minmax(0,1fr)_15rem]">
          <div>
            <dl className="divide-y divide-border">
              {officeHours.slots.map(slot => (
                <div key={slot.day} className="py-4 flex items-baseline gap-5">
                  <dt className="font-mono text-sm text-brass w-[5.5rem] flex-shrink-0">
                    {slot.day}
                  </dt>
                  <dd className="min-w-0">
                    <span className="font-serif text-lg text-foreground tabular-nums">
                      {slot.times}
                    </span>
                    <span className="block text-sm text-muted-foreground mt-0.5">
                      {slot.mode}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="text-[15px] leading-relaxed text-muted-foreground mt-6 max-w-[52ch]">
              {officeHours.note}
            </p>
          </div>

          <aside className="space-y-8">
            <div>
              <h2 className="font-mono text-[10px] tracking-[0.14em] uppercase text-brass mb-3">
                Where
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {officeLabel}
                <br />
                {officeLocation}
              </p>
            </div>
            <div>
              <h2 className="font-mono text-[10px] tracking-[0.14em] uppercase text-brass mb-3">
                Zoom link
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Posted on your course home page in Canvas, so it stays with the class it
                belongs to.
              </p>
            </div>
            <div>
              <h2 className="font-mono text-[10px] tracking-[0.14em] uppercase text-brass mb-3">
                Can&rsquo;t make these?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <a
                  href={`mailto:${profile.email}`}
                  className="text-primary hover:underline underline-offset-2 break-words"
                >
                  {profile.email}
                </a>
                {' — '}other times can usually be arranged.
              </p>
            </div>
          </aside>
        </div>

        <p className="border-t border-foreground/15 py-6 text-sm text-muted-foreground">
          Checked against Canvas on <time dateTime={officeHours.updated}>{formatted}</time>.
          Your course page in{' '}
          <Link href="/courses" className="text-primary hover:underline underline-offset-2">
            Canvas
          </Link>{' '}
          is always the authority if these differ.
        </p>
      </main>
    </div>
  );
}
