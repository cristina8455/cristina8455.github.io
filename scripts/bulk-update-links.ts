/**
 * Bulk update Canvas page links to open in new tabs
 *
 * Usage:
 *   npx tsx scripts/bulk-update-links.ts [--dry-run] [--backup]
 *
 * Options:
 *   --dry-run  Preview changes without updating Canvas
 *   --backup   Save original page content to backups/ before updating
 *
 * Updates:
 * - Notes and Assignments pages for all Spring 2026 courses
 * - All Day pages for all Spring 2026 courses
 */

import { config } from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

config({ path: '.env.local' });

const CANVAS_BASE_URL = process.env.CANVAS_BASE_URL;
const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;

if (!CANVAS_BASE_URL || !CANVAS_API_TOKEN) {
  console.error('Error: CANVAS_BASE_URL and CANVAS_API_TOKEN must be set');
  process.exit(1);
}

// Spring 2026 courses to update
const COURSES = [
  { id: 57795, code: 'MTH122-008' },
  { id: 57799, code: 'MTH122-202' },
  { id: 57889, code: 'MTH140-201' },
];

interface PageSummary {
  url: string;
  title: string;
}

async function getPages(courseId: number): Promise<PageSummary[]> {
  const response = await fetch(
    `${CANVAS_BASE_URL}/api/v1/courses/${courseId}/pages?per_page=100`,
    { headers: { 'Authorization': `Bearer ${CANVAS_API_TOKEN}` } }
  );
  return response.json();
}

async function getPage(courseId: number, pageUrl: string): Promise<{ title: string; body: string }> {
  const response = await fetch(
    `${CANVAS_BASE_URL}/api/v1/courses/${courseId}/pages/${pageUrl}`,
    { headers: { 'Authorization': `Bearer ${CANVAS_API_TOKEN}` } }
  );
  return response.json();
}

async function updatePage(courseId: number, pageUrl: string, body: string): Promise<void> {
  const response = await fetch(
    `${CANVAS_BASE_URL}/api/v1/courses/${courseId}/pages/${pageUrl}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${CANVAS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wiki_page: { body } }),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to update: ${response.status}`);
  }
}

function addTargetBlankToLinks(html: string): { updatedHtml: string; linksUpdated: number } {
  let linksUpdated = 0;

  const updatedHtml = html.replace(
    /<a\s+([^>]*?)href\s*=\s*["']([^"'#][^"']*)["']([^>]*)>/gi,
    (match, before, href, after) => {
      if (/target\s*=\s*["']_blank["']/i.test(before + after)) return match;
      if (href.startsWith('javascript:')) return match;

      linksUpdated++;

      const cleanBefore = before.replace(/target\s*=\s*["'][^"']*["']\s*/gi, '');
      const cleanAfter = after.replace(/target\s*=\s*["'][^"']*["']\s*/gi, '');
      const beforeNoRel = cleanBefore.replace(/rel\s*=\s*["'][^"']*["']\s*/gi, '');
      const afterNoRel = cleanAfter.replace(/rel\s*=\s*["'][^"']*["']\s*/gi, '');

      return `<a ${beforeNoRel}href="${href}"${afterNoRel} target="_blank" rel="noopener noreferrer">`;
    }
  );

  return { updatedHtml, linksUpdated };
}

function saveBackup(courseId: number, courseCode: string, pageUrl: string, html: string): void {
  const backupDir = join(process.cwd(), 'backups', `${courseId}-${courseCode}`);
  mkdirSync(backupDir, { recursive: true });
  const filePath = join(backupDir, `${pageUrl}.html`);
  writeFileSync(filePath, html, 'utf-8');
}

async function processPage(
  courseId: number,
  courseCode: string,
  pageUrl: string,
  dryRun: boolean,
  backup: boolean
): Promise<{ title: string; linksUpdated: number }> {
  const page = await getPage(courseId, pageUrl);
  const { updatedHtml, linksUpdated } = addTargetBlankToLinks(page.body);

  if (linksUpdated > 0 && !dryRun) {
    if (backup) {
      saveBackup(courseId, courseCode, pageUrl, page.body);
    }
    await updatePage(courseId, pageUrl, updatedHtml);
  }

  return { title: page.title, linksUpdated };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const backup = process.argv.includes('--backup');

  console.log(dryRun ? '=== DRY RUN ===' : '=== UPDATING PAGES ===');
  if (backup && !dryRun) console.log('Backups will be saved to backups/');
  console.log('');

  let totalPages = 0;
  let totalLinks = 0;

  for (const course of COURSES) {
    console.log(`\n📚 ${course.code} (${course.id})`);
    console.log('─'.repeat(40));

    const pages = await getPages(course.id);

    // Find Notes and Assignments page
    const notesPage = pages.find(p =>
      /notes\s*(and|&)\s*assignments/i.test(p.title) &&
      /spring/i.test(p.title)
    );

    // Find Day pages
    const dayPages = pages.filter(p => /^day\s*\d+/i.test(p.title));

    // Process Notes and Assignments page
    if (notesPage) {
      const result = await processPage(course.id, course.code, notesPage.url, dryRun, backup);
      if (result.linksUpdated > 0) {
        console.log(`  ✓ ${result.title}: ${result.linksUpdated} links`);
        totalLinks += result.linksUpdated;
        totalPages++;
      } else {
        console.log(`  - ${result.title}: no links to update`);
      }
    }

    // Process Day pages
    for (const dayPage of dayPages) {
      const result = await processPage(course.id, course.code, dayPage.url, dryRun, backup);
      if (result.linksUpdated > 0) {
        console.log(`  ✓ ${result.title}: ${result.linksUpdated} links`);
        totalLinks += result.linksUpdated;
        totalPages++;
      }
    }
  }

  console.log('\n' + '═'.repeat(40));
  console.log(`Total: ${totalPages} pages, ${totalLinks} links ${dryRun ? 'would be ' : ''}updated`);

  if (dryRun) {
    console.log('\nRun without --dry-run to apply changes.');
  }
}

main().catch(console.error);
