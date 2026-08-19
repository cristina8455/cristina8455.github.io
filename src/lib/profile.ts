/**
 * Instructor details that are not in Canvas.
 *
 * Everything else on this site comes from the Canvas API, but a few facts —
 * office number, email, building — have no Canvas field to read them from and
 * were duplicated across pages. One office move meant editing three files.
 *
 * If any of these ever gains a reliable Canvas source, read it from there
 * instead of here.
 */

export const profile = {
  name: 'Cristina Sizemore',
  email: 'csizemore@clcillinois.edu',
  institution: 'College of Lake County',
  office: {
    room: 'C162',
    building: 'Building C',
    floor: 'First Floor',
  },
} as const;

/** "Room C162" — how the office is written in running text. */
export const officeLabel = `Room ${profile.office.room}`;

/** "Building C, First Floor" — the secondary line under the room number. */
export const officeLocation = `${profile.office.building}, ${profile.office.floor}`;

/**
 * Office hours, maintained by hand.
 *
 * These used to be scraped out of a Canvas front page by about two hundred
 * lines of regex that used emoji as delimiters and inferred AM/PM from
 * heuristics. It failed silently — the live page was showing "check Canvas"
 * for the whole of the Fall term while the hours sat published in Canvas the
 * entire time, and nothing reported it, because the failure mode and the
 * "nothing published yet" mode rendered identically.
 *
 * Typing a schedule twice a year is cheaper than maintaining that, and the
 * `updated` date below does the thing the parser never could: make staleness
 * visible instead of invisible. Update both when the term changes.
 */
export const officeHours = {
  term: 'Fall 2026',
  /** ISO date these were last checked against Canvas. Shown on the page. */
  updated: '2026-08-19',
  slots: [
    { day: 'Tuesday',   times: '10:00–11:30am and 3:00–3:30pm', mode: 'in person' },
    { day: 'Wednesday', times: '10:30–11:30am',                 mode: 'on Zoom' },
    { day: 'Thursday',  times: '11:00am–12:30pm and 3:00–3:30pm', mode: 'in person' },
  ],
  note: 'Zoom is also available during the in-person hours — email me first so I know to open the meeting.',
} as const;
