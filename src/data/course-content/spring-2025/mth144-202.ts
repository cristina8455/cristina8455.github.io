import { DayContent } from '@/types/notes';
import { generateCourseWeeks } from '@/utils/dateUtils';
import { currentTerm } from '@/data/courses';

// Define course-specific dates
const courseStartDate = '2025-02-05'; // Late start date
const courseEndDate = currentTerm.endDate; // Keep same end date as term

export const COURSE_WEEKS = generateCourseWeeks(courseStartDate, courseEndDate);

export const courseContent: Record<string, DayContent> = {
    // Week 1 (Starting Feb 5)
    '2025-02-05': {
        notes: [
            {
                title: 'Course Introduction',
                blank: {
                    url: '/notes/mth144-202/intro-blank.pdf',
                    label: 'Course Overview'
                }
            },
            {
                title: 'Section 1.1: Functions and Their Graphs',
                blank: {
                    url: '/notes/mth144-202/1.1-blank.pdf',
                    label: 'Blank Notes'
                }
            }
        ],
        assignments: [
            {
                id: 'syllabus-quiz',
                title: 'Syllabus Quiz',
                type: 'quiz',
                dueDate: new Date('2025-02-07'),
                dueTime: '11:59 PM',
                link: 'https://canvas.college.edu/courses/12345'
            }
        ]
    },
    '2025-02-06': {
        isHoliday: true,
        holidayName: 'MLK Day - No Classes'
    },
    '2025-02-07': {
        notes: [
            {
                title: 'Section 1.2: Linear Functions',
                blank: {
                    url: '/notes/mth144-202/1.2-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-202/1.2-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: '1.1-hw',
                title: 'Section 1.1 Homework',
                type: 'homework',
                dueDate: new Date('2025-02-14'),
                dueTime: '11:59 PM',
                link: 'https://www.webassign.net'
            }
        ]
    },

    // Week 2
    '2025-02-12': {
        notes: [
            {
                title: 'Section 1.3: Quadratic Functions',
                blank: {
                    url: '/notes/mth144-202/1.3-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-202/1.3-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: '1.2-hw',
                title: 'Section 1.2 Homework',
                type: 'homework',
                dueDate: new Date('2025-02-14'),
                dueTime: '11:59 PM',
                link: 'https://www.webassign.net'
            }
        ]
    },
    '2025-02-16': {
        notes: [
            {
                title: 'Section 1.4: Other Common Functions',
                blank: {
                    url: '/notes/mth144-202/1.4-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-202/1.4-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ],
        assignments: [
            {
                id: 'quiz1',
                title: 'Quiz 1: Sections 1.1-1.3',
                type: 'quiz',
                dueDate: new Date('2025-02-16'),
                dueTime: '11:59 PM',
                link: 'https://canvas.college.edu/courses/12345/quizzes'
            }
        ]
    },

    // Week 3 - Exam Week
    '2025-02-19': {
        notes: [
            {
                title: 'Exam 1 Review',
                blank: {
                    url: '/notes/mth144-202/exam1-review-blank.pdf',
                    label: 'Review Sheet'
                },
                completed: {
                    url: '/notes/mth144-202/exam1-review-completed.pdf',
                    label: 'Completed Review'
                }
            }
        ],
        assignments: [
            {
                id: '1.4-hw',
                title: 'Section 1.4 Homework',
                type: 'homework',
                dueDate: new Date('2025-02-19'),
                dueTime: '11:59 PM',
                link: 'https://www.webassign.net'
            }
        ]
    },
    '2025-02-21': {
        assignments: [
            {
                id: 'exam1',
                title: 'Exam 1: Chapter 1',
                type: 'exam',
                dueDate: new Date('2025-02-21'),
                dueTime: '11:59 PM',
                description: 'Covers Sections 1.1-1.4. Available on Canvas from 8:00 AM to 11:59 PM.',
                link: 'https://canvas.college.edu/courses/12345/quizzes'
            }
        ]
    },

    // Week 4
    '2025-02-26': {
        notes: [
            {
                title: 'Section 2.1: Polynomial Functions',
                blank: {
                    url: '/notes/mth144-202/2.1-blank.pdf',
                    label: 'Blank Notes'
                },
                completed: {
                    url: '/notes/mth144-202/2.1-completed.pdf',
                    label: 'Completed Notes'
                }
            }
        ]
    }
};

export function getCourseContent(): Record<string, DayContent> {
    return courseContent;
} 