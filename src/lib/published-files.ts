import fallbackManifest from '@/data/published-files.json';

/**
 * Course files published to a static host, keyed by Canvas file id.
 *
 * Canvas file links are behind CLC's single sign-on, so nobody outside the
 * college can open them. Publishing the PDFs elsewhere fixes that, but the
 * files cannot live in this repo: Vercel caps a Hobby deployment's source
 * files at 100 MB and the corpus is around 490 MB. So they are hosted
 * separately and only this map is needed here.
 *
 * The map is fetched from the host, which publishes it alongside the files.
 * That is deliberate: the alternative is a job in the archive repo pushing a
 * regenerated map into this one, which needs a long-lived cross-account write
 * token — the kind of credential this project has been removing.
 *
 * `@/data/published-files.json` is the floor, not the source of truth. It is
 * whatever was committed last and is used when the host cannot be reached.
 * A stale copy is never *wrong*: paths are content-addressed, so an entry
 * never changes meaning. It can only be short of newer files, and those fall
 * back to Canvas exactly as they did before anything was published.
 *
 * Every layer degrades to the previous behaviour:
 *
 *   no NEXT_PUBLIC_FILES_CDN_URL  -> no rewriting at all
 *   host unreachable              -> committed map, possibly short
 *   id not in the map             -> that link stays on Canvas
 *
 * and in every case `markCanvasLinks` labels what is left as needing a CLC
 * login. Losing the host costs convenience, never a working page.
 */

export type FileManifest = Record<string, string>;

const fallback = fallbackManifest as FileManifest;

/** Base URL of the file host, or null when none is configured. */
export function filesCdnBase(): string | null {
  const base = process.env.NEXT_PUBLIC_FILES_CDN_URL?.trim();
  return base ? base.replace(/\/+$/, '') : null;
}

export interface PublishedFiles {
  lookup: (canvasFileId: string) => string | null;
  count: number;
  /** Where the map came from, for the health check. */
  source: 'host' | 'committed' | 'none';
}

/**
 * Current file map. Cached for 24 hours alongside the rest of the ISR content,
 * so this is one request per revalidation rather than one per page view.
 */
export async function getPublishedFiles(): Promise<PublishedFiles> {
  const base = filesCdnBase();
  if (!base) {
    return { lookup: () => null, count: 0, source: 'none' };
  }

  let manifest = fallback;
  let source: PublishedFiles['source'] = 'committed';

  try {
    const response = await fetch(`${base}/manifest.json`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(10000),
    });
    if (response.ok) {
      const fetched = (await response.json()) as FileManifest;
      // Guard against an empty or malformed body replacing a good floor.
      if (fetched && typeof fetched === 'object' && Object.keys(fetched).length > 0) {
        manifest = fetched;
        source = 'host';
      }
    }
  } catch {
    // Unreachable or slow: keep the committed map. Not worth failing a page
    // over — the consequence is some links staying on Canvas.
  }

  return {
    lookup: (canvasFileId: string) => {
      const path = manifest[canvasFileId];
      return path ? `${base}/${path.replace(/^\/+/, '')}` : null;
    },
    count: Object.keys(manifest).length,
    source,
  };
}

/** Size of the committed floor. Used by the health check. */
export function committedFileCount(): number {
  return Object.keys(fallback).length;
}
