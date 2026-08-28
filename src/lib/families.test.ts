import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { familyCode, familyLabel, familyName, courseTitle } from './families';

describe('familyCode', () => {
  test('drops the section', () => {
    assert.equal(familyCode('MTH122 008'), 'MTH122');
    assert.equal(familyCode('MTH122 201/202'), 'MTH122');
    assert.equal(familyCode('MTH122 201 Fall 2025'), 'MTH122');
    assert.equal(familyCode('MTH140 001'), 'MTH140');
  });

  test('tolerates no space', () => {
    assert.equal(familyCode('MTH146004'), 'MTH146');
  });

  test('falls back to the whole code when unparseable', () => {
    assert.equal(familyCode('Special Topics'), 'SPECIAL TOPICS');
  });
});

describe('familyLabel', () => {
  test('separates subject and number', () => {
    assert.equal(familyLabel('MTH122'), 'MTH 122');
  });
});

describe('familyName', () => {
  test('strips section and meeting time noise', () => {
    // The real Canvas name for MTH142.
    assert.equal(
      familyName(['General Education Statistics Section 8 MW 2:30pm']),
      'General Education Statistics'
    );
  });

  test('strips a term name', () => {
    assert.equal(familyName(['College Algebra Fall 2025']), 'College Algebra');
  });

  test('prefers the shortest clean candidate', () => {
    // Several sections of one course, named inconsistently.
    assert.equal(
      familyName(['College Algebra 201 and 202', 'College Algebra']),
      'College Algebra'
    );
  });

  test('leaves a already-clean name alone', () => {
    assert.equal(familyName(['Contemporary Mathematics']), 'Contemporary Mathematics');
  });
});

describe('familyName — meeting days and majority', () => {
  test('strips slash-separated meeting days', () => {
    assert.equal(familyName(['Contemporary Math T/Th']), 'Contemporary Math');
    assert.equal(familyName(['Precalculus M/W/F']), 'Precalculus');
  });

  test('strips run-together meeting days', () => {
    assert.equal(familyName(['Statistics MWF']), 'Statistics');
    assert.equal(familyName(['Statistics TTh']), 'Statistics');
  });

  test('does not eat ordinary words that look like day codes', () => {
    // Lower-case "mw" is not a meeting pattern; the match is case-sensitive.
    assert.equal(familyName(['Malawi Mathematics']), 'Malawi Mathematics');
  });

  test('the majority spelling wins over the shortest', () => {
    // One section named carelessly must not rename the course.
    assert.equal(
      familyName([
        'Contemporary Mathematics',
        'Contemporary Mathematics',
        'Contemporary Math',
      ]),
      'Contemporary Mathematics'
    );
  });

  test('shortest still breaks a tie', () => {
    assert.equal(familyName(['Precalculus Online', 'Precalculus']), 'Precalculus');
  });
});

describe('courseTitle', () => {
  test('falls back when the name is just the course number', () => {
    // The real Canvas name for MTH122 401, which rendered as the page title.
    assert.equal(courseTitle('MTH 122 401 and 402', 'College Algebra'), 'College Algebra');
    assert.equal(courseTitle('MTH146 004', 'Calc & Analytic Geometry II'),
                 'Calc & Analytic Geometry II');
  });

  test('strips paired section numbers from a real title', () => {
    assert.equal(courseTitle('College Algebra 201 and 202', 'College Algebra'),
                 'College Algebra');
    assert.equal(courseTitle('Contemporary Math 201/202', 'Contemporary Math'),
                 'Contemporary Math');
  });

  test('strips a leading season', () => {
    assert.equal(courseTitle('Spring Contemporary Math', 'Contemporary Math'),
                 'Contemporary Math');
  });

  test('leaves a good title alone', () => {
    assert.equal(courseTitle('Precalculus Online', 'Precalculus'), 'Precalculus Online');
    assert.equal(courseTitle('General Education Statistics', 'General Education Statistics'),
                 'General Education Statistics');
  });

  test('falls back on an empty name', () => {
    assert.equal(courseTitle('', 'College Algebra'), 'College Algebra');
  });
});
