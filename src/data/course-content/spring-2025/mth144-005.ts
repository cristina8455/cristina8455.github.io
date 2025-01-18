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
                title: 'Course Introduction',
                blank: {
                    url: '/notes/mth144-005/intro-blank.pdf',
                    label: 'Course Overview'
                }
            },
            {
                title: 'Section P.1: Real Numbers',
                blank: {
                    url: '/notes/mth144-005/p1-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-005/p1-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: 'syllabus-quiz',
                title: 'Syllabus Quiz',
                type: 'quiz',
                dueDate: new Date('2025-01-24'),
                dueTime: '11:59 PM',
                link: 'https://canvas.college.edu/courses/12345'
            }
        ]
    },
    '2025-01-23': {
        notes: [
            {
                title: 'Section P.2: Exponents and Radicals',
                blank: {
                    url: '/notes/mth144-005/p2-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-005/p2-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: 'p1-hw',
                title: 'Section P.1 Homework',
                type: 'homework',
                dueDate: new Date('2025-01-24'),
                dueTime: '11:59 PM',
                link: 'https://www.webassign.net'
            }
        ]
    },

    // Week 2
    '2025-01-27': {
        notes: [
            {
                title: 'Section P.3: Polynomials',
                blank: {
                    url: '/notes/mth144-005/p3-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-005/p3-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: 'p2-hw',
                title: 'Section P.2 Homework',
                type: 'homework',
                dueDate: new Date('2025-01-29'),
                dueTime: '11:59 PM',
                link: 'https://www.webassign.net'
            }
        ]
    },
    '2025-01-31': {
        notes: [
            {
                title: 'Section P.4: Factoring',
                blank: {
                    url: '/notes/mth144-005/p4-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-005/p4-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: 'quiz1',
                title: 'Quiz 1: Sections P.1-P.3',
                type: 'quiz',
                dueDate: new Date('2025-01-31'),
                dueTime: '2:00 PM',
                description: 'In-class quiz. Bring a calculator.'
            }
        ]
    },

    // Week 3
    '2025-02-03': {
        notes: [
            {
                title: 'Chapter P Review',
                blank: {
                    url: '/notes/mth144-005/chp-review-blank.pdf',
                    label: 'Review Sheet'
                },
                completed: {
                    url: '/notes/mth144-005/chp-review-completed.pdf',
                    label: 'Completed Review'
                }
            }
        ],
        assignments: [
            {
                id: 'p4-hw',
                title: 'Section P.4 Homework',
                type: 'homework',
                dueDate: new Date('2025-02-04'),
                dueTime: '11:59 PM',
                link: 'https://www.webassign.net'
            }
        ]
    },
    '2025-02-05': {
        assignments: [
            {
                id: 'exam1',
                title: 'Exam 1: Chapter P',
                type: 'exam',
                dueDate: new Date('2025-02-05'),
                dueTime: '2:00 PM',
                description: 'Covers all sections from Chapter P. Bring a calculator and pencil.',
            }
        ]
    }
};

export function getCourseContent(): Record<string, DayContent> {
    return courseContent;
} 