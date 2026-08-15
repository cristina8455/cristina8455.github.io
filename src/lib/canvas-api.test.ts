import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  parseTimeRange,
  normalizeDay,
  parseScheduleLine,
  seasonOf,
  sanitizeCanvasHtml,
} from './canvas-api';

/**
 * These cover the hand-written parsers — the only logic here that is not a
 * thin wrapper over the Canvas API, and the only part that can be wrong
 * without anything failing loudly. The office-hours parser in particular
 * degrades to a fallback message when it misreads, so a silent regression
 * looks identical to "no office hours published".
 */

describe('parseTimeRange', () => {
  test('same period on both ends', () => {
    assert.deepEqual(parseTimeRange('9-10am'), { start: '9:00 AM', end: '10:00 AM' });
    assert.deepEqual(parseTimeRange('2-3pm'), { start: '2:00 PM', end: '3:00 PM' });
  });

  test('keeps explicit minutes', () => {
    assert.deepEqual(parseTimeRange('10-11:30am'), { start: '10:00 AM', end: '11:30 AM' });
  });

  test('noon start stays PM', () => {
    // 12:30-1pm is half past noon, not half past midnight.
    assert.deepEqual(parseTimeRange('12:30-1pm'), { start: '12:30 PM', end: '1:00 PM' });
  });

  test('morning start with an afternoon end is inferred as AM', () => {
    // 11:30-1pm spans noon: the start must be AM even though the range is
    // labelled pm. This is the inference most likely to break.
    assert.deepEqual(parseTimeRange('11:30-1pm'), { start: '11:30 AM', end: '1:00 PM' });
    assert.deepEqual(parseTimeRange('10-1pm'), { start: '10:00 AM', end: '1:00 PM' });
  });

  test('afternoon range that does not span noon stays PM', () => {
    assert.deepEqual(parseTimeRange('1-3pm'), { start: '1:00 PM', end: '3:00 PM' });
  });

  test('tolerates surrounding whitespace', () => {
    assert.deepEqual(parseTimeRange('  9 - 10am '), { start: '9:00 AM', end: '10:00 AM' });
  });

  test('returns null when there is no time range', () => {
    assert.equal(parseTimeRange('by appointment'), null);
    assert.equal(parseTimeRange(''), null);
    assert.equal(parseTimeRange('9-10'), null); // no am/pm to anchor on
  });
});

describe('normalizeDay', () => {
  test('expands the abbreviations Canvas pages actually use', () => {
    assert.equal(normalizeDay('Mon'), 'Monday');
    assert.equal(normalizeDay('tues'), 'Tuesday');
    assert.equal(normalizeDay('THURS'), 'Thursday');
    assert.equal(normalizeDay('wed'), 'Wednesday');
  });

  test('passes through full names regardless of case', () => {
    assert.equal(normalizeDay('friday'), 'Friday');
    assert.equal(normalizeDay('Monday'), 'Monday');
  });

  test('leaves anything unrecognised alone', () => {
    assert.equal(normalizeDay('Weekdays'), 'Weekdays');
  });
});

describe('parseScheduleLine', () => {
  test('splits multiple day/time pairs on a semicolon', () => {
    const slots = parseScheduleLine('Tuesday 9-10am; Wed 10-11:30am', 'virtual');
    assert.equal(slots.length, 2);
    assert.deepEqual(slots[0], {
      day: 'Tuesday', start: '9:00 AM', end: '10:00 AM', type: 'virtual',
    });
    assert.deepEqual(slots[1], {
      day: 'Wednesday', start: '10:00 AM', end: '11:30 AM', type: 'virtual',
    });
  });

  test('a bare time inherits the previous day', () => {
    // "Thursday 12:30-1pm; 3:15-3:45pm" means two slots on Thursday.
    const slots = parseScheduleLine('Thursday 12:30-1pm; 3:15-3:45pm', 'in-person');
    assert.equal(slots.length, 2);
    assert.equal(slots[0].day, 'Thursday');
    assert.equal(slots[1].day, 'Thursday');
    assert.equal(slots[1].start, '3:15 PM');
  });

  test('carries the type through', () => {
    const slots = parseScheduleLine('Monday 1-2pm', 'in-person');
    assert.equal(slots[0].type, 'in-person');
  });

  test('ignores fragments with no parseable time', () => {
    const slots = parseScheduleLine('Monday 1-2pm; by appointment', 'virtual');
    assert.equal(slots.length, 1);
  });

  test('returns nothing for an unparseable line', () => {
    assert.deepEqual(parseScheduleLine('email for an appointment', 'virtual'), []);
    assert.deepEqual(parseScheduleLine('', 'virtual'), []);
  });

  test('a leading bare time with no prior day is dropped', () => {
    // Nothing to attach it to, so it must not invent a day.
    assert.deepEqual(parseScheduleLine('9-10am', 'virtual'), []);
  });
});

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
});
