/**
 * Update Canvas page links to open in new tabs
 *
 * Usage:
 *   npx tsx scripts/update-canvas-links.ts <course-id> <page-url>
 *
 * Example:
 *   npx tsx scripts/update-canvas-links.ts 57795 notes-and-assignments-page-16-weeks-spring
 *
 * This script:
 * 1. Fetches the current page HTML from Canvas
 * 2. Adds target="_blank" rel="noopener noreferrer" to all <a> tags
 * 3. Updates the page on Canvas via PUT request
 *
 * Requires CANVAS_BASE_URL and CANVAS_API_TOKEN in .env.local
 */

import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL;
const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;

if (!CANVAS_BASE_URL || !CANVAS_API_TOKEN) {
  console.error('Error: CANVAS_BASE_URL and CANVAS_API_TOKEN must be set in .env.local');
  process.exit(1);
}

interface CanvasPage {
  page_id: string;
  url: string;
  title: string;
  body: string;
}

async function getPage(courseId: number, pageUrl: string): Promise<CanvasPage> {
  const url = `${CANVAS_BASE_URL}/api/v1/courses/${courseId}/pages/${pageUrl}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${CANVAS_API_TOKEN}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function updatePage(courseId: number, pageUrl: string, body: string): Promise<void> {
  const url = `${CANVAS_BASE_URL}/api/v1/courses/${courseId}/pages/${pageUrl}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CANVAS_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      wiki_page: {
        body: body,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to update page: ${response.status} ${response.statusText}\n${text}`);
  }
}

function addTargetBlankToLinks(html: string): { updatedHtml: string; linksUpdated: number } {
  let linksUpdated = 0;

  // Match <a> tags that don't already have target="_blank"
  // This regex handles various attribute orderings
  const updatedHtml = html.replace(
    /<a\s+([^>]*?)href\s*=\s*["']([^"'#][^"']*)["']([^>]*)>/gi,
    (match, before, href, after) => {
      // Skip if already has target="_blank"
      if (/target\s*=\s*["']_blank["']/i.test(before + after)) {
        return match;
      }

      // Skip javascript: links
      if (href.startsWith('javascript:')) {
        return match;
      }

      linksUpdated++;

      // Remove any existing target attribute
      const cleanBefore = before.replace(/target\s*=\s*["'][^"']*["']\s*/gi, '');
      const cleanAfter = after.replace(/target\s*=\s*["'][^"']*["']\s*/gi, '');

      // Remove any existing rel attribute (we'll add a new one)
      const beforeNoRel = cleanBefore.replace(/rel\s*=\s*["'][^"']*["']\s*/gi, '');
      const afterNoRel = cleanAfter.replace(/rel\s*=\s*["'][^"']*["']\s*/gi, '');

      return `<a ${beforeNoRel}href="${href}"${afterNoRel} target="_blank" rel="noopener noreferrer">`;
    }
  );

  return { updatedHtml, linksUpdated };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: npx tsx scripts/update-canvas-links.ts <course-id> <page-url>');
    console.log('');
    console.log('Example:');
    console.log('  npx tsx scripts/update-canvas-links.ts 57795 notes-and-assignments-page-16-weeks-spring');
    console.log('');
    console.log('Options:');
    console.log('  --dry-run    Preview changes without updating Canvas');
    process.exit(1);
  }

  const courseId = parseInt(args[0]);
  const pageUrl = args[1];
  const dryRun = args.includes('--dry-run');

  if (isNaN(courseId)) {
    console.error('Error: course-id must be a number');
    process.exit(1);
  }

  console.log(`Fetching page: ${pageUrl} from course ${courseId}...`);
  const page = await getPage(courseId, pageUrl);
  console.log(`Page title: ${page.title}`);
  console.log(`Original body length: ${page.body.length} chars`);

  const { updatedHtml, linksUpdated } = addTargetBlankToLinks(page.body);

  console.log(`Links updated: ${linksUpdated}`);

  if (linksUpdated === 0) {
    console.log('No links needed updating.');
    return;
  }

  if (dryRun) {
    console.log('\n--- DRY RUN ---');
    console.log('Would update the page with target="_blank" on all links.');
    console.log('Run without --dry-run to apply changes.');
    return;
  }

  console.log('Updating page on Canvas...');
  await updatePage(courseId, pageUrl, updatedHtml);
  console.log('Done! Page updated successfully.');
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
