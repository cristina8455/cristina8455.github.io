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
                },
                completed: {
                    url: '/notes/mth144-005/Day3PrecalcCompleted.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: 'HW3',
                title: 'Homework 3 - WebAssign',
                type: 'homework',
                dueDate: new Date('2025-02-5'),
                dueTime: '11:59 PM',
                link: 'https://webassign.net/'
            }
        ]
    },

    // Week 3
    '2025-02-03': {
        notes: [
            {
                title: 'Day 4 Notes',
                blank: {
                    url: '/notes/mth144-005/Day4PrecalcBlank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-005/Day4PrecalcCompleted.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        resources: [
            {
                title: 'Algebra Quick Reference',
                url: '/notes/mth144-005/AlgebraQuickRefrence.pdf',
                label: 'Download pdf'
            }
        ],
        assignments: [
            {
                id: 'HW4',
                title: 'Homework 4 - WebAssign',
                type: 'homework',
                dueDate: new Date('2025-02-10'),
                dueTime: '11:59 PM',
                link: 'https://webassign.net/'
            }
        ]
    },
    '2025-02-05': {
        notes: [
            {
                title: 'Day 5 Notes',
                blank: {
                    url: '/notes/mth144-005/Day5PrecalcBlank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-005/Day5NotesPrecalcCompleted.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: 'HW5',
                title: 'Homework 5 - WebAssign',
                type: 'homework',
                dueDate: new Date('2025-02-12'),
                dueTime: '11:59 PM',
                link: 'https://webassign.net/'
            }
        ]
    },
    '2025-02-10': {
        notes: [
            {
                title: 'Day 6 Notes',
                blank: {
                    url: '/notes/mth144-005/Day_6_Notes_Precalc_Blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-005/Day_6_Notes_Precalc_Completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: 'practice-exam-1',
                title: 'Practice Problems Exam 1 - WebAssign',
                type: 'homework',
                dueDate: new Date('2025-02-12'),
                dueTime: '11:59 PM',
                link: 'https://webassign.net/'
            }
        ]
    }
};

export function getCourseContent(): Record<string, DayContent> {
    return courseContent;
} 
