import { config } from 'dotenv';
config({ path: '.env.local' });

const courseId = process.argv[2] || '57795';
const pageUrl = process.argv[3] || 'notes-and-assignments-page-16-weeks-spring';

async function main() {
  const response = await fetch(
    `${process.env.CANVAS_BASE_URL}/api/v1/courses/${courseId}/pages/${pageUrl}`,
    { headers: { 'Authorization': `Bearer ${process.env.CANVAS_API_TOKEN}` } }
  );
  const page = await response.json();
  const html = page.body;

  // Extract all links
  const linkRegex = /<a\s+([^>]*)href\s*=\s*["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  let i = 1;

  console.log('Links that would be updated (no target="_blank"):\n');

  while ((match = linkRegex.exec(html)) !== null) {
    const before = match[1];
    const href = match[2];
    const after = match[3];
    const text = match[4].replace(/<[^>]+>/g, '').trim().substring(0, 60);

    const hasBlank = /target\s*=\s*["']_blank["']/i.test(before + after);

    // Skip anchor links and already-blank links
    if (hasBlank || href.startsWith('#')) continue;

    console.log(`${i++}. "${text}"`);
    console.log(`   ${href.substring(0, 120)}`);
    console.log();
  }

  console.log(`Total: ${i - 1} links would be updated`);
}

main();
