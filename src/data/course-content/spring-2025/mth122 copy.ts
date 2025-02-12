import { DayContent } from '@/types/notes';

const courseContent: Record<string, DayContent> = {
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

            },
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
    '2025-01-23': {
        notes: [
            {
                title: 'Section 8.2: Arithmetic Sequences and Series',
                blank: {
                    url: '/notes/mth122/8.2-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth122/8.2-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: '8.2-hw',
                title: 'Aleks HW 2',
                type: 'homework',
                dueDate: new Date('2025-01-30'),
                dueTime: '11:59 PM',
                link: 'https://clcillinois.instructure.com/courses/49127/external_tools/9470'
            }
        ]
    },

    // Week 2
    '2025-01-28': {
        notes: [
            {
                title: 'Section 8.3: Geometric Sequences',
                blank: {
                    url: '/notes/mth122/8.3-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth122/8.3-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: '8.3-hw',
                title: 'Aleks HW 3',
                type: 'homework',
                dueDate: new Date('2025-01-30'),
                dueTime: '11:59 PM',
                link: 'https://www.webassign.net'
            }
        ]
    },
    '2025-01-30': {
        notes: [
            {
                title: 'Section 2.4: Measures of Variation',
                blank: {
                    url: '/notes/mth122/2.4-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth122/2.4-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: 'quiz1',
                title: 'Quiz 1: Sections 2.1-2.3',
                type: 'quiz',
                dueDate: new Date('2025-01-31'),
                dueTime: '11:59 PM',
                link: 'https://canvas.college.edu/courses/12345/quizzes'
            }
        ]
    },

    // Week 3 - Exam Week
    '2025-02-04': {
        notes: [
            {
                title: 'Exam 1 Review',
                blank: {
                    url: '/notes/mth122/exam1-review-blank.pdf',
                    label: 'Review Sheet'
                },
                completed: {
                    url: '/notes/mth122/exam1-review-completed.pdf',
                    label: 'Completed Review'
                }
            }
        ]
    },
    '2025-02-06': {
        assignments: [
            {
                id: 'exam1',
                title: 'Exam 1: Descriptive Statistics',
                type: 'exam',
                dueDate: new Date('2025-02-06'),
                dueTime: '3:20 PM',
                description: 'Covers Sections 2.1-2.4. Bring a calculator and pencil.',
            }
        ]
    }
};

export function getCourseContent(): Record<string, DayContent> {
    return courseContent;
} 
