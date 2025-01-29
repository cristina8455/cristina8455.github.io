import { DayContent } from '@/types/notes';
import { generateCourseWeeks } from '@/utils/dateUtils';
import { currentTerm } from '@/data/courses';

export const COURSE_WEEKS = generateCourseWeeks(currentTerm.startDate, currentTerm.endDate);

export const courseContent: Record<string, DayContent> = {
    // Week 1
    '2025-01-20': {
        isHoliday: true,
        holidayName: 'MLK Day - No Classes'
    },
    '2025-01-22': {
        notes: [
            {
                title: 'Course Pretest',
                blank: {
                    url: '/notes/mth144-005/PretestPrecalcBlank.pdf',
                    label: 'Blank Pretest'
                }
            },
            {
                title: 'Day 1 Notes',
                blank: {
                    url: '/notes/mth144-005/Day1NotesPrecalcBlank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-005/Day1NotesPrecalcCompleted.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: 'HW1',
                title: 'Homework 1 - WebAssign',
                type: 'homework',
                dueDate: new Date('2025-01-29'),
                dueTime: '11:59 PM',
                link: 'https://webassign.net/'
            }
        ]
    },

    // Week 2
    '2025-01-27': {
        notes: [
            {
                title: 'Day 2 Notes',
                blank: {
                    url: '/notes/mth144-005/Day2NotesPrecalcBlank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-005/Day2PrecalcCompletedNotes.pdf',
                    label: 'Completed Notes'
                }
            },
            {
                title: 'Domains Practice',
                blank: {
                    url: '/notes/mth144-005/PrecalcDomainFunctions.pdf',
                    label: 'Domains Practice'
                }
            },
            {
                title: 'Piecewise Practice',
                blank: {
                    url: '/notes/mth144-005/PrecalcPiecewiseFunctions.pdf',
                    label: 'Piecewise Practice'
                }
            }
        ],
        assignments: [
            {
                id: 'HW2',
                title: 'Homework 2 - WebAssign',
                type: 'homework',
                dueDate: new Date('2025-02-3'),
                dueTime: '11:59 PM',
                link: 'https://webassign.net/'
            }
        ]
    },
    '2025-01-29': {
        notes: [
         {
                title: 'Day 3 Notes',
                blank: {
                    url: '/notes/mth144-005/Day3PrecalcNotesBlank.pdf',
                    label: 'Blank Notes'
                }//,
                //completed: {
                  //  url: '/notes/mth144-005/Day2PrecalcCompletedNotes.pdf',
                   // label: 'Completed Notes'
               // }
            }
        ],
        assignments: [

        ]
    },

    // Week 3
    '2025-02-03': {
        notes: [

        ],
        assignments: [

        ]
    },
    '2025-02-05': {
        assignments: [

        ]
    }
};

export function getCourseContent(): Record<string, DayContent> {
    return courseContent;
} 
