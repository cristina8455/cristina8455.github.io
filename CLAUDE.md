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

### Routes
- `src/app/page.tsx` - Home (current courses)
- `src/app/courses/page.tsx` - All courses by term
- `src/app/courses/[term]/[courseSlug]/page.tsx` - Course homepage (Notes & Assignments)
- `src/app/courses/[term]/[courseSlug]/[page]/page.tsx` - Individual Canvas pages
- `src/app/courses/[term]/[courseSlug]/syllabus/page.tsx` - Course syllabus
- `src/app/office-hours/page.tsx` - Office hours (static)
- `src/app/resources/page.tsx` - Student resources (static)

### Scripts
- `scripts/update-canvas-links.ts` - Update links on Canvas pages to open in new tabs
- `scripts/analyze-links.ts` - Analyze links on a Canvas page

## Environment Variables

```bash
# .env.local
CANVAS_BASE_URL=https://clcillinois.instructure.com
CANVAS_API_TOKEN=<token from Canvas settings>
```

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

## Caching

- ISR revalidation: 24 hours
- GitHub Action warms cache daily at 6 AM UTC
- Manual revalidation: redeploy on Vercel or wait for cache expiry

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS
- Deployed on Vercel
