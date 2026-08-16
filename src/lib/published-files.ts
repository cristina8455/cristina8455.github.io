import manifest from '@/data/published-files.json';

/**
 * Course files published to a static host, keyed by Canvas file id.
 *
 * Canvas file links are behind CLC's single sign-on, so nobody outside the
 * college can open them. Publishing the PDFs elsewhere fixes that, but the
 * files themselves cannot live in this repo: Vercel caps a Hobby deployment's
 * source files at 100 MB and the corpus is around 515 MB.
 *
 * So the files are hosted separately and only this map ships with the site —
 * a few hundred short entries rather than half a gigabyte of PDFs. It is
 * generated from the archive in `canvas-courses`, which is where the files are
 * captured and where the same document uploaded across several terms is
 * already deduplicated by content.
 *
 * Everything here degrades to nothing:
 *
 *   - no `NEXT_PUBLIC_FILES_CDN_URL` set  -> no rewriting at all
 *   - file id absent from the manifest    -> that one link stays on Canvas
 *
 * In either case the link keeps working exactly as before and
 * `markCanvasLinks` labels it as needing a CLC login. Losing the host is a
 * loss of convenience, never a broken page — the mistake this whole project
 * started from was letting a dependency become load-bearing without a path
 * for its absence.
 */

const files = manifest as Record<string, string>;

/** Base URL of the file host, or null when none is configured. */
export function filesCdnBase(): string | null {
  const base = process.env.NEXT_PUBLIC_FILES_CDN_URL?.trim();
  return base ? base.replace(/\/+$/, '') : null;
}

/** Published URL for a Canvas file id, or null to leave the link on Canvas. */
export function publishedFileUrl(canvasFileId: string): string | null {
  const base = filesCdnBase();
  if (!base) return null;

  const path = files[canvasFileId];
  return path ? `${base}/${path.replace(/^\/+/, '')}` : null;
}

/** How many files are published. Used by the health check. */
export function publishedFileCount(): number {
  return Object.keys(files).length;
}
