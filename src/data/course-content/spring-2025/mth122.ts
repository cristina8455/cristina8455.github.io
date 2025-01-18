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
                    url: '/notes/mth122/intro-blank.pdf',
                    label: 'Course Overview'
                }
            },
            {
                title: 'Section 2.1: Organizing Data',
                blank: {
                    url: '/notes/mth122/2.1-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth122/2.1-completed.pdf',
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
                title: 'Section 2.2: Visualizing Data',
                blank: {
                    url: '/notes/mth122/2.2-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth122/2.2-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: '2.1-hw',
                title: 'Section 2.1 Homework',
                type: 'homework',
                dueDate: new Date('2025-01-24'),
                dueTime: '11:59 PM',
                link: 'https://www.webassign.net'
            }
        ]
    },

    // Week 2
    '2025-01-28': {
        notes: [
            {
                title: 'Section 2.3: Measures of Center',
                blank: {
                    url: '/notes/mth122/2.3-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth122/2.3-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: '2.2-hw',
                title: 'Section 2.2 Homework',
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