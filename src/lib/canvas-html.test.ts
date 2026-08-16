import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { prepareCanvasHtml } from './canvas-html';

/**
 * Order is the thing worth testing here. Marking Canvas links before the
 * rewriters run would leave the hrefs unchanged and mark links that should
 * have become local — and nothing would fail, the page would just quietly
 * send everyone to a login screen.
 */
describe('prepareCanvasHtml', () => {
  const C = 'https://clcillinois.instructure.com';
  const ctx = {
    courseId: 57799,
    termSlug: 'spring-2026',
    courseSlug: 'mth122-202',
    publishedSlugs: new Set(['day-1-intro']),
  };

  test('strips the DesignPlus stylesheet', () => {
    const out = prepareCanvasHtml(`<link rel="stylesheet" href="${C}/dp_app.css"><p>x</p>`);
    assert.equal(out.includes('<link'), false);
  });

  test('a mirrored page link becomes local and is not marked', () => {
    const out = prepareCanvasHtml(`<a href="${C}/courses/57799/pages/day-1-intro">Notes</a>`, ctx);
    assert.match(out, /href="\/courses\/spring-2026\/mth122-202\/day-1-intro"/);
    assert.equal(out.includes('canvas-link'), false);
  });

  test('an unmirrored Canvas link survives and is marked', () => {
    const out = prepareCanvasHtml(`<a href="${C}/courses/57799/assignments/1">Submit</a>`, ctx);
    assert.match(out, /canvas-link/);
    assert.match(out, /CLC login required/);
  });

  test('file links stay on Canvas and are marked while nothing is published', () => {
    // NEXT_PUBLIC_FILES_CDN_URL is unset in tests, so publishedFileUrl returns
    // null for everything — the shipping default until files are hosted.
    const out = prepareCanvasHtml(`<a href="${C}/courses/57799/files/13883659">PDF</a>`, ctx);
    assert.match(out, /instructure\.com/);
    assert.match(out, /canvas-link/);
  });

  test('a published file is repointed and not marked', () => {
    const lookup = (id: string) =>
      id === '13883659' ? 'https://files.example/f/ab/notes.pdf' : null;
    const out = prepareCanvasHtml(`<a href="${C}/courses/57799/files/13883659">PDF</a>`, ctx, lookup);
    assert.match(out, /href="https:\/\/files\.example\/f\/ab\/notes\.pdf"/);
    assert.equal(out.includes('canvas-link'), false);
  });

  test('an unpublished file stays on Canvas and is marked', () => {
    const lookup = () => null;
    const out = prepareCanvasHtml(`<a href="${C}/courses/57799/files/999">PDF</a>`, ctx, lookup);
    assert.match(out, /instructure\.com/);
    assert.match(out, /canvas-link/);
  });

  test('works with no rewrite context at all', () => {
    // Individual page and syllabus routes call it this way.
    const out = prepareCanvasHtml(`<a href="${C}/courses/57799/files/1">PDF</a>`);
    assert.match(out, /canvas-link/);
  });
});
