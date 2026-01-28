# Canvas Utility Scripts

Scripts for programmatically managing Canvas LMS course content.

## Prerequisites

Set up `.env.local` in the project root:

```bash
CANVAS_BASE_URL=https://clcillinois.instructure.com
CANVAS_API_TOKEN=<your-token>
```

To get a Canvas API token:
1. Log into Canvas
2. Go to Account → Settings
3. Scroll to "Approved Integrations"
4. Click "+ New Access Token"

## Scripts

### bulk-update-links.ts

Updates all links on Notes & Assignments pages and Day pages for configured courses to open in new tabs.

```bash
# Preview changes
npx tsx scripts/bulk-update-links.ts --dry-run

# Apply changes with backup
npx tsx scripts/bulk-update-links.ts --backup

# Apply without backup
npx tsx scripts/bulk-update-links.ts
```

Backups are saved to `backups/<course-id>-<course-code>/` as HTML files.

To configure courses, edit the `COURSES` array in the script.

### update-canvas-links.ts

Updates all links on a single Canvas page to open in new tabs (`target="_blank"`).

```bash
# Preview changes (dry run)
npx tsx scripts/update-canvas-links.ts <course-id> <page-url> --dry-run

# Apply changes
npx tsx scripts/update-canvas-links.ts <course-id> <page-url>
```

**Example:**
```bash
npx tsx scripts/update-canvas-links.ts 57795 notes-and-assignments-page-16-weeks-spring
```

### analyze-links.ts

Lists all links on a Canvas page that would be updated (don't already have `target="_blank"`).

```bash
npx tsx scripts/analyze-links.ts <course-id> <page-url>
```

## Finding Course IDs and Page URLs

### Get course ID
The course ID is in the Canvas URL: `https://canvas.example.com/courses/57795` → ID is `57795`

### List page URLs for a course
```bash
source .env.local
curl -s "$CANVAS_BASE_URL/api/v1/courses/<course-id>/pages" \
  -H "Authorization: Bearer $CANVAS_API_TOKEN" | jq -r '.[] | "\(.url) - \(.title)"'
```

## Adding New Scripts

The pattern for Canvas API scripts:

1. Load environment: `import { config } from 'dotenv'; config({ path: '.env.local' });`
2. Fetch content: `GET /api/v1/courses/:id/pages/:url`
3. Transform content
4. Update content: `PUT /api/v1/courses/:id/pages/:url` with `{ wiki_page: { body: newHtml } }`

See Canvas API docs: https://canvas.instructure.com/doc/api/
