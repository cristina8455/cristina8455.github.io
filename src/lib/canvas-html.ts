import {
  sanitizeCanvasHtml,
  rewriteCanvasLinks,
  rewriteCanvasFileLinks,
  markCanvasLinks,
  type LinkRewriteContext,
} from '@/lib/canvas-api';

/** Resolves a Canvas file id to a published URL, or null to leave it alone. */
export type FileLookup = (canvasFileId: string) => string | null;

const noFiles: FileLookup = () => null;

/**
 * Everything that has to happen to Canvas HTML before it is rendered.
 *
 * One function because the order matters and there are three places that
 * inject this content. Getting the order wrong is silent: mark the links
 * first and the rewriters stop matching, because the hrefs are no longer
 * pointing at Canvas.
 *
 *   1. sanitize  — drop <link>/<style>/<script> and Canvas's data-api-*
 *                  attributes. Canvas embeds the account's DesignPlus
 *                  stylesheet in page bodies, and injected that way it styles
 *                  the whole document, not the content area.
 *   2. pages     — repoint page links at this site, which already serves them.
 *   3. files     — repoint file links at published copies, where they exist.
 *   4. mark      — whatever still points at Canvas gets labelled as needing a
 *                  CLC login, so a visitor is not sent into an unexplained
 *                  Microsoft sign-in page.
 *
 * Steps 2 and 3 are both optional and both degrade to leaving the link alone,
 * which step 4 then handles. The page renders correctly with neither.
 */
export function prepareCanvasHtml(
  html: string,
  ctx?: LinkRewriteContext,
  files: FileLookup = noFiles,
): string {
  let out = sanitizeCanvasHtml(html);
  if (ctx) out = rewriteCanvasLinks(out, ctx);
  out = rewriteCanvasFileLinks(out, files);
  return markCanvasLinks(out);
}
