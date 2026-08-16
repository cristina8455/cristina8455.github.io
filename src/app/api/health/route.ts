/**
 * Health check for the Canvas data source.
 *
 * The site uses ISR, which serves the last good render indefinitely when
 * revalidation fails — so a dead Canvas token looks exactly like a healthy
 * site. This endpoint is the thing that can tell the difference, and the
 * daily workflow fails on anything other than "healthy".
 *
 * Never cached: it has to reflect the state of Canvas right now.
 */

import { filesCdnBase, publishedFileCount } from '@/lib/published-files';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Warn this many days before the token's recorded expiry. */
const EXPIRY_WARNING_DAYS = 30;

type Status = 'healthy' | 'warning' | 'unhealthy';

interface Check {
  name: string;
  ok: boolean;
  detail: string;
}

function rank(status: Status): number {
  return status === 'unhealthy' ? 2 : status === 'warning' ? 1 : 0;
}

function worst(a: Status, b: Status): Status {
  return rank(a) >= rank(b) ? a : b;
}

export async function GET() {
  const checks: Check[] = [];
  let status: Status = 'healthy';

  const baseUrl = process.env.CANVAS_BASE_URL;
  const token = process.env.CANVAS_API_TOKEN;

  // 1. Configuration present
  if (!baseUrl || !token) {
    checks.push({
      name: 'config',
      ok: false,
      detail: `Missing ${!baseUrl ? 'CANVAS_BASE_URL' : ''}${!baseUrl && !token ? ' and ' : ''}${!token ? 'CANVAS_API_TOKEN' : ''}`,
    });
    return respond('unhealthy', checks);
  }
  checks.push({ name: 'config', ok: true, detail: 'Canvas credentials present' });

  // 2. Canvas reachable and the token accepted
  try {
    const res = await fetch(`${baseUrl}/api/v1/users/self`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });

    if (res.ok) {
      checks.push({ name: 'canvas-auth', ok: true, detail: `Authenticated (HTTP ${res.status})` });
    } else {
      // Canvas reports the expiry date in the body of an expired-token 401.
      let detail = `HTTP ${res.status} ${res.statusText}`;
      try {
        const body = await res.json();
        const message = body?.errors?.[0]?.message;
        const expiredAt = body?.errors?.[0]?.expired_at;
        if (message) detail += ` — ${message}`;
        if (expiredAt) detail += ` (expired ${String(expiredAt).slice(0, 10)})`;
      } catch {
        // Non-JSON error body; the status line is enough.
      }
      checks.push({ name: 'canvas-auth', ok: false, detail });
      status = 'unhealthy';
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    checks.push({ name: 'canvas-auth', ok: false, detail: `Request failed: ${reason}` });
    status = 'unhealthy';
  }

  // 3. Token expiry, if we've been told when it is
  const expiresAt = process.env.CANVAS_TOKEN_EXPIRES_AT;
  if (!expiresAt) {
    checks.push({
      name: 'token-expiry',
      ok: true,
      detail: 'Unknown — set CANVAS_TOKEN_EXPIRES_AT to enable advance warning',
    });
  } else {
    const expiry = new Date(expiresAt);
    if (Number.isNaN(expiry.getTime())) {
      checks.push({
        name: 'token-expiry',
        ok: false,
        detail: `CANVAS_TOKEN_EXPIRES_AT is not a valid date: "${expiresAt}"`,
      });
      status = worst(status, 'warning');
    } else {
      const days = Math.floor((expiry.getTime() - Date.now()) / 86_400_000);
      if (days < 0) {
        checks.push({ name: 'token-expiry', ok: false, detail: `Token expired ${-days} day(s) ago` });
        status = 'unhealthy';
      } else if (days <= EXPIRY_WARNING_DAYS) {
        checks.push({ name: 'token-expiry', ok: false, detail: `Token expires in ${days} day(s) — rotate it` });
        status = worst(status, 'warning');
      } else {
        checks.push({ name: 'token-expiry', ok: true, detail: `${days} day(s) remaining` });
      }
    }
  }

  // 4. Published course files. Optional by design — with no host configured
  //    every file link simply stays on Canvas. The one state worth reporting
  //    is a half-configured one, where a host is set but nothing is listed,
  //    because then the links silently fall back and look the same as before.
  const cdn = filesCdnBase();
  const published = publishedFileCount();
  if (!cdn && published === 0) {
    checks.push({
      name: 'course-files',
      ok: true,
      detail: 'Not published — file links point at Canvas (CLC login required)',
    });
  } else if (cdn && published === 0) {
    checks.push({
      name: 'course-files',
      ok: false,
      detail: `NEXT_PUBLIC_FILES_CDN_URL is set (${cdn}) but no files are listed in ` +
              'published-files.json, so every link still falls back to Canvas',
    });
    status = worst(status, 'warning');
  } else if (!cdn && published > 0) {
    checks.push({
      name: 'course-files',
      ok: false,
      detail: `${published} file(s) listed but NEXT_PUBLIC_FILES_CDN_URL is not set`,
    });
    status = worst(status, 'warning');
  } else {
    checks.push({
      name: 'course-files',
      ok: true,
      detail: `${published} file(s) published via ${cdn}`,
    });
  }

  return respond(status, checks);
}

function respond(status: Status, checks: Check[]) {
  return Response.json(
    {
      status,
      checkedAt: new Date().toISOString(),
      checks,
    },
    {
      // 503 only when the data source is actually broken; an expiry warning
      // still serves traffic fine, so the workflow catches it via `status`.
      status: status === 'unhealthy' ? 503 : 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    }
  );
}
