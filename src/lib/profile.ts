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
