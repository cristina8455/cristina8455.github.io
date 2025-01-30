// src/data/office-hours.ts
import type { TermOfficeHours } from '@/types/office-hours';

export const currentTermOfficeHours: TermOfficeHours = {
    term: 'Spring 2025',
    schedule: [
        {
            day: 'Monday',
            times: [
                {
                    start: '12:00 PM',
                    end: '1:00 PM',
                    type: 'in-person',
                }
            ]
        },
        {
            day: 'Wednesday',
            times: [
                {
                    start: '10:00 AM',
                    end: '12:00 PM',
                    type: 'in-person',
                }
            ]
        },
        {
            day: 'Thursday',
            times: [
                {
                    start: '12:30 PM',
                    end: '2:30 PM',
                    type: 'virtual',
                }
            ]
        }
    ],
    defaultLocation: {
        room: 'C162',
        building: 'C',
        floor: 'First Floor',
    },
    virtualMeetingInfo: {
        platform: 'Zoom',
        link: 'https://clcillinois.zoom.us/j/93962968272?pwd=kea7Ih0Q46dl7xpnAqEmT6kAfjQqhb.1',  // To be added
        // meetingId: 'your-meeting-id',              // To be added
        // password: 'if-required',                   // Optional
    },
    additionalNotes: [
        'Additional appointments available by email request.',
        'Virtual office hours use Zoom at the link above.',
    ]
};

// Future enhancement: Calendar integration configuration
export const calendarConfig = {
    provider: 'Office365',
    calendarId: 'primary',
    // Add Azure AD configuration when ready
};

// Future enhancement: Topic tags
export const topicTags = [
    // Examples - to be implemented later
    // { id: 'mth122-hw', name: 'MTH 122 Homework', course: 'MTH 122', color: 'blue' },
    // { id: 'mth144-exam', name: 'MTH 144 Exam Prep', course: 'MTH 144', color: 'green' },
];
