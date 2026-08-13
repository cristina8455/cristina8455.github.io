/**
 * Canonical public origin, used by sitemap.xml and robots.txt.
 *
 * Vercel exposes the production hostname at build and request time, so this
 * stays correct without hardcoding — but NEXT_PUBLIC_SITE_URL wins if a real
 * domain is ever attached.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return 'https://cristina8455.vercel.app';
}
