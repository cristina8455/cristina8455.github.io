# CLAUDE.md

Project context for Claude Code sessions.

## Project Overview

Academic website for a math instructor at College of Lake County. The site automatically syncs course content from Canvas LMS - the instructor updates Canvas, and the website reflects those changes automatically.

## Architecture

**Canvas-first design:** All course content comes from the Canvas API. No manual content files.

```
Canvas LMS (source of truth)
    ↓ API (24-hour ISR cache)
Next.js on Vercel (read-only mirror)
```

## Key Files

### Core Data Layer
- `src/lib/canvas-api.ts` - Canvas API client (courses, pages, syllabus)
- `src/lib/courses.ts` - Course utilities, slug generation, filtering
- `src/lib/site.ts` - Canonical public origin for sitemap/robots

### Routes
- `src/app/page.tsx` - Home (current courses, falls back to most recent term)
- `src/app/courses/page.tsx` - All courses by term
- `src/app/courses/[term]/[courseSlug]/page.tsx` - Course homepage (Notes & Assignments)
- `src/app/courses/[term]/[courseSlug]/[page]/page.tsx` - Individual Canvas pages
- `src/app/courses/[term]/[courseSlug]/syllabus/page.tsx` - Course syllabus
- `src/app/office-hours/page.tsx` - Office hours (auto-synced from Canvas front page)
- `src/app/resources/page.tsx` - Student resources (static)

### Operations
- `src/app/api/health/route.ts` - Canvas reachability + token expiry check (never cached)
- `src/app/sitemap.ts` - Generated from Canvas; also drives cache warming
- `src/app/robots.ts` - Points crawlers at the sitemap
- `src/app/error.tsx`, `src/app/global-error.tsx` - Error boundaries
- `src/components/layout/SyncStamp.tsx` - "Last synced" footer

### Scripts
- `scripts/load-env.ts` - Credential cascade shared by the scripts below
- `scripts/bulk-update-links.ts` - Bulk update links across multiple courses/pages
- `scripts/update-canvas-links.ts` - Update links on a single Canvas page
- `scripts/analyze-links.ts` - Analyze links on a Canvas page

## Environment Variables

Credentials resolve in this order, first file to define a variable wins —
matching `canvas-cli` and `canvas-courses`:

1. `./.env.local`
2. `./.env`
3. `~/.config/canvas/.env` (mode 600, shared by all the Canvas repos)

Keeping the token only in the shared file makes rotation a one-place edit.
**This applies to `scripts/` only** — the deployed site reads Vercel's own
environment variables, so a rotated token must also be updated there.

```bash
CANVAS_BASE_URL=https://clcillinois.instructure.com
CANVAS_API_TOKEN=<token from Canvas settings>

# Optional but recommended, set in Vercel. Enables the health check to warn
# 30 days before the token dies instead of discovering it after the fact.
CANVAS_TOKEN_EXPIRES_AT=2027-07-18
```

### Rotating the Canvas token
1. Canvas → Account → Settings → Approved Integrations → **+ New Access Token**
2. Replace the value in `~/.config/canvas/.env`
3. Update `CANVAS_API_TOKEN` **and** `CANVAS_TOKEN_EXPIRES_AT` in the Vercel project
4. Redeploy, then confirm `/api/health` reports `"status": "healthy"`

## Common Tasks

### Run locally
```bash
npm run dev
```

### Update Canvas page links to open in new tabs
```bash
npx tsx scripts/update-canvas-links.ts <course-id> <page-url> --dry-run
npx tsx scripts/update-canvas-links.ts <course-id> <page-url>
```

### Find Canvas page URLs
```bash
# List all pages for a course
curl -s "$CANVAS_BASE_URL/api/v1/courses/<id>/pages" \
  -H "Authorization: Bearer $CANVAS_API_TOKEN" | jq -r '.[].url'
```

### Deploy
Push to `main` branch → Vercel auto-deploys.

## Course Filtering Rules

Defined in `src/lib/courses.ts`:
- Only courses from Fall 2024 onward (when she started at CLC)
- Excludes "Math Dept Resources" course
- Content page matching: "Notes and Assignments" OR "Calendar and Daily Notes"

## Caching & Monitoring

- ISR revalidation: 24 hours
- Manual revalidation: redeploy on Vercel or wait for cache expiry

The daily GitHub Action (`warm-cache.yml`, 6 AM UTC) does three things:

1. **Health gate** — calls `/api/health` and fails the job unless the status is
   `healthy`. This is the alarm; without it a dead token is invisible, because
   ISR keeps serving the last good render indefinitely.
2. **Warms from the sitemap** — reads `sitemap.xml` and requests every URL, so
   new courses are picked up without editing the workflow.
3. **Keepalive** — commits a heartbeat if the repo has been quiet for 45+ days.
   GitHub disables scheduled workflows after 60 days of inactivity, which is
   exactly how this job silently stopped running in April 2026.

### If the site looks stale
```bash
curl -s https://cristina8455.vercel.app/api/health | jq .
```
`unhealthy` means Canvas is refusing the token — rotate it (see above).
The "Last synced" date in the site footer shows when a page was generated.

## Canvas HTML Restrictions

When creating/updating Canvas pages via API, content is sanitized. Key points:
- No JavaScript or event handlers
- No `<style>` blocks (inline `style=""` works)
- No form elements
- `<details>`/`<summary>` work for collapsible sections
- Flexbox and Grid CSS work

See [docs/canvas-html-restrictions.md](docs/canvas-html-restrictions.md) for full reference.

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS
- Deployed on Vercel
