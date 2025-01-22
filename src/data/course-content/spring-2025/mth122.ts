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

            }
        ]
    },
    '2025-01-23': {
        notes: [
            {
                title: 'Section 8.1: Sequences and Series - continued',
                //blank: {
                  //  url: '/notes/mth122/8.2-blank.pdf',
                    //label: 'Blank Notes'
                }//,
                //completed: {
                    //url: '/notes/mth122/8.2-completed.pdf',
                //    label: 'Completed Notes'
               // }
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
                title: 'Section 8.3: Geometric Sequences',
                blank: {
                    url: '/notes/mth122/8.3-blank.pdf',
                    label: 'Blank Notes'
                }//,
                //completed: {
                    //url: '/notes/mth122/8.3-completed.pdf',
                //    label: 'Completed Notes'
               // }
            }
        ],
        assignments: [

        ]
    },
    '2025-01-30': {
        notes: [
            {
                title: '',
                blank: {
                    url: '/notes/mth122/2.4-blank.pdf',
                    label: 'Blank Notes'
                },
                //completed: {
                    //url: '/notes/mth122/2.4-completed.pdf',
                 //   label: 'Completed Notes'
                //}
            }
        ],
        assignments: [

        ]
    },


};

export function getCourseContent(): Record<string, DayContent> {
    return courseContent;
} 
