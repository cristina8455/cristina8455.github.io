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
    '2025-01-21': {
        notes: [
            {
                title: 'Course Introductions',
            },
            {
                title: 'Section 8.1: Sequences and Series',
                blank: {
                    url: '/notes/mth122/8.1-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth122/8.1-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: 'Quiz 0',
                title: 'Quiz 0 Intros',
                type: 'quiz',
                dueDate: new Date('2025-01-28'),
                dueTime: '11:59 PM',
                link: 'https://forms.office.com/r/ube0VdD1sT'

            }
        ]
    },
    '2025-01-23': {
        notes: [
            {
                title: 'Section 8.1: Sequences and Series - continued',
                blank: {
                    url: '/notes/mth122/Day1ActivityMth122Key.pdf',
                    label: 'Activity Key'
                },
                completed: {
                    url: '/notes/mth122/Day2Mth122.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: '8.1-hw',
                title: 'Aleks Homework 1',
                type: 'homework',
                dueDate: new Date('2025-01-28'),
                dueTime: '11:59 PM',
                link: 'https://clcillinois.instructure.com/courses/49127/external_tools/9470'
            }
        ]
    },

    // Week 2
    '2025-01-28': {
        notes: [
            {
                title: 'Section 8.2: Arithmetic Sequences',
                blank: {
                    url: '/notes/mth122/Day3NotesMth122Blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth122/Day3NotesMth122.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: '8.2-hw',
                title: 'Aleks Homework 2',
                type: 'homework',
                dueDate: new Date('2025-02-4'),
                dueTime: '11:59 PM',
                link: 'https://clcillinois.instructure.com/courses/49127/external_tools/9470'
            }
        ]
    },
    '2025-01-30': {
        notes: [
            {
                title: 'Section 8.3 Geometric Sequences and 2.1 Coordinate Plane',
                blank: {
                    url: '/notes/mth122/Da4CABlank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth122/Da4CACompleted.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        resources: [
            {
                title: 'Quiz 1 Key',
                url: '/notes/mth122/Group_Quiz_1_Mth_122Key.pdf',
                label: 'View Key'
            }
        ],
        assignments: [
            {
                id: '8.3-hw',
                title: 'Aleks Homework 3',
                type: 'homework',
                dueDate: new Date('2025-02-6'),
                dueTime: '11:59 PM',
                link: 'https://clcillinois.instructure.com/courses/49127/external_tools/9470'
            }
        ]
    },
 // Week 3
    '2025-02-04': {
        notes: [
            {
                title: 'Section 2.2: Circles and Review',
                //blank: {
                   // url: '/notes/mth122/Day5NotesMth122Blank.pdf',
                   // label: 'Blank Notes'
                //},
                //completed: {
                   // url: '/notes/mth122/Day5NotesMth122.pdf',
                   // label: 'Completed Notes'
                //}
            }
        ],
        assignments: [
            {
                id: '2.2-hw',
                title: 'Aleks Homework 4',
                type: 'homework',
                dueDate: new Date('2025-02-11'),
                dueTime: '11:59 PM',
                link: 'https://clcillinois.instructure.com/courses/49127/external_tools/9470'
            }
        ]
    },
    '2025-02-06': {
        notes: [
            {
                title: 'Section 7.1 The Ellipse',
                blank: {
                    url: '/notes/mth122/Day6CABlank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth122/Day6CACompleted.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        resources: [
            {
                title: 'Quiz 1 Key',
                url: '/notes/mth122/Group_Quiz_1_Mth_122Key.pdf',
                label: 'View Key'
            }
        ],
        assignments: [
            {
                id: '8.3-hw',
                title: 'Aleks Homework 5',
                type: 'homework',
                dueDate: new Date('2025-02-13'),
                dueTime: '11:59 PM',
                link: 'https://clcillinois.instructure.com/courses/49127/external_tools/9470'
            }
        ]
    },

};

// This function can be removed since we're exporting courseContent directly
// export function getCourseContent(): Record<string, DayContent> {
//     return courseContent;
// } 
