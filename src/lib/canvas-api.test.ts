import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  seasonOf,
  sanitizeCanvasHtml,
  rewriteCanvasLinks,
  rewriteCanvasFileLinks,
  markCanvasLinks,
} from './canvas-api';

/**
 * These cover the hand-written parsers — the only logic here that is not a
 * thin wrapper over the Canvas API, and the only part that can be wrong
 * without anything failing loudly. The office-hours parser in particular
 * degrades to a fallback message when it misreads, so a silent regression
 * looks identical to "no office hours published".
 */

describe('seasonOf', () => {
  test('finds the season in a term name', () => {
    assert.equal(seasonOf('Summer 2026'), 'summer');
    assert.equal(seasonOf('Fall 2024'), 'fall');
  });

  test('finds the season in a page title', () => {
    assert.equal(seasonOf('Notes and Assignments Page 16 weeks Spring'), 'spring');
  });

  test('is null when no season is named', () => {
    assert.equal(seasonOf('Course Calendar'), null);
    assert.equal(seasonOf('Day 12 Review: Factoring'), null);
  });

  test('matches whole words only', () => {
    // Guards the calendar fix: a page must not be judged stale because some
    // unrelated word happens to contain a season.
    assert.equal(seasonOf('Springboard problems'), null);
    assert.equal(seasonOf('Downfall of the empire'), null);
  });
});

describe('sanitizeCanvasHtml', () => {
  test('removes the DesignPlus stylesheet Canvas embeds in page bodies', () => {
    const body = '<link rel="stylesheet" href="https://x.s3.amazonaws.com/dp_app.css"><p>Hi</p>';
    const out = sanitizeCanvasHtml(body);
    assert.equal(out.includes('<link'), false);
    assert.equal(out.includes('<p>Hi</p>'), true);
  });

  test('removes style and script blocks', () => {
    const body = '<style>body{display:none}</style><p>a</p><script>alert(1)</script>';
    const out = sanitizeCanvasHtml(body);
    assert.equal(/<style|<script/.test(out), false);
    assert.equal(out.includes('<p>a</p>'), true);
  });

  test('keeps inline style attributes', () => {
    // Element-level styling is scoped and is how the page was authored.
    const body = '<p style="color: red">a</p>';
    assert.equal(sanitizeCanvasHtml(body), '<p style="color: red">a</p>');
  });

  test('leaves ordinary content untouched', () => {
    const body = '<h2>Week 1</h2><ul><li><a href="/x">Notes</a></li></ul>';
    assert.equal(sanitizeCanvasHtml(body), body);
  });

  test('strips the data-api-* attributes Canvas adds to internal links', () => {
    // These outlive link rewriting, leaving a local href beside a
    // data-api-endpoint that still names Canvas.
    const body = '<a title="Day 2" href="/x" data-api-endpoint="https://c.instructure.com/api/v1/x"' +
                 ' data-api-returntype="Page" data-course-type="wiki_page" data-published="true">D2</a>';
    const out = sanitizeCanvasHtml(body);
    assert.equal(/data-api-endpoint|data-api-returntype|data-course-type|data-published/.test(out), false);
    assert.match(out, /title="Day 2"/);
    assert.match(out, /href="\/x"/);
  });
});

describe('rewriteCanvasLinks', () => {
  const ctx = {
    courseId: 62966,
    termSlug: 'fall-2026',
    courseSlug: 'mth122-401',
    publishedSlugs: new Set(['day-1-intro', 'course-calendar']),
  };
  const C = 'https://clcillinois.instructure.com';

  test('rewrites a page link to the mirror', () => {
    assert.equal(
      rewriteCanvasLinks(`<a href="${C}/courses/62966/pages/day-1-intro">Notes</a>`, ctx),
      '<a href="/courses/fall-2026/mth122-401/day-1-intro">Notes</a>'
    );
  });

  test('leaves assignments, quizzes and discussions on Canvas', () => {
    // These are things a student does, not content that was mirrored, so a
    // login prompt is correct and a local 404 would not be.
    for (const path of ['assignments/1423975', 'quizzes/123', 'discussion_topics/596231']) {
      const html = `<a href="${C}/courses/62966/${path}">x</a>`;
      assert.equal(rewriteCanvasLinks(html, ctx), html);
    }
  });

  test('leaves files alone', () => {
    const html = `<a href="${C}/courses/62966/files/13883659?verifier=abc">pdf</a>`;
    assert.equal(rewriteCanvasLinks(html, ctx), html);
  });

  test('does not rewrite a page belonging to a different course', () => {
    // The slug might coincidentally exist here; the target does not.
    const html = `<a href="${C}/courses/57799/pages/day-1-intro">x</a>`;
    assert.equal(rewriteCanvasLinks(html, ctx), html);
  });

  test('does not rewrite a page this site does not serve', () => {
    // Unpublished pages are filtered out upstream, so the mirror has no copy.
    const html = `<a href="${C}/courses/62966/pages/secret-draft">x</a>`;
    assert.equal(rewriteCanvasLinks(html, ctx), html);
  });

  test('leaves unresolved Canvas placeholders alone', () => {
    // $CANVAS_OBJECT_REFERENCE$ links are broken in Canvas too, left behind
    // by course copies. Not ours to reinterpret.
    const html = '<a href="$CANVAS_OBJECT_REFERENCE$/quizzes/gb2520b2e">quiz</a>';
    assert.equal(rewriteCanvasLinks(html, ctx), html);
  });

  test('rewrites every occurrence', () => {
    const html = `<a href="${C}/courses/62966/pages/day-1-intro">a</a>` +
                 `<a href="${C}/courses/62966/pages/course-calendar">b</a>`;
    const out = rewriteCanvasLinks(html, ctx);
    assert.equal(out.includes('instructure.com'), false);
  });
});

describe('rewriteCanvasFileLinks', () => {
  const C = 'https://clcillinois.instructure.com';
  const lookup = (id: string) =>
    id === '13883659' ? 'https://files.example/f/ab/notes.pdf' : null;

  test('repoints a published file at its copy', () => {
    const html = `<a href="${C}/courses/57799/files/13883659?verifier=abc">Notes</a>`;
    assert.equal(
      rewriteCanvasFileLinks(html, lookup),
      '<a href="https://files.example/f/ab/notes.pdf">Notes</a>'
    );
  });

  test('leaves an unpublished file on Canvas', () => {
    // The normal case while most of the corpus is unpublished.
    const html = `<a href="${C}/courses/57799/files/99999?verifier=abc">Notes</a>`;
    assert.equal(rewriteCanvasFileLinks(html, lookup), html);
  });

  test('leaves everything alone when nothing is published', () => {
    const html = `<a href="${C}/courses/57799/files/13883659">a</a>`;
    assert.equal(rewriteCanvasFileLinks(html, () => null), html);
  });

  test('does not touch page or assignment links', () => {
    const html = `<a href="${C}/courses/57799/assignments/1">a</a>` +
                 `<a href="${C}/courses/57799/pages/day-1">b</a>`;
    assert.equal(rewriteCanvasFileLinks(html, lookup), html);
  });
});

describe('markCanvasLinks', () => {
  const C = 'https://clcillinois.instructure.com';

  test('marks a link that still points at Canvas', () => {
    const out = markCanvasLinks(`<a href="${C}/courses/1/assignments/2">Submit</a>`);
    assert.match(out, /class="[^"]*canvas-link/);
    assert.match(out, /target="_blank"/);
    assert.match(out, /rel="noopener noreferrer"/);
    assert.match(out, /title="Opens in Canvas — CLC login required"/);
  });

  test('preserves an existing class', () => {
    const out = markCanvasLinks(`<a class="btn" href="${C}/courses/1/files/2">pdf</a>`);
    assert.match(out, /class="btn canvas-link"/);
  });

  test('leaves non-Canvas links untouched', () => {
    for (const html of [
      '<a href="/courses/fall-2026/mth146-004/day-1">local</a>',
      '<a href="https://files.example/f/ab/notes.pdf">published copy</a>',
      '<a href="https://example.com/x">external</a>',
    ]) {
      assert.equal(markCanvasLinks(html), html);
    }
  });

  test('is idempotent', () => {
    // Pages are re-rendered on every ISR revalidation; marking twice must not
    // stack attributes.
    const once = markCanvasLinks(`<a href="${C}/courses/1/files/2">pdf</a>`);
    assert.equal(markCanvasLinks(once), once);
  });
});
