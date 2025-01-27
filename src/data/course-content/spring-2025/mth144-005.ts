import { DayContent } from '@/types/notes';

const courseContent: Record<string, DayContent> = {
    // Week 1
    '2025-01-20': {
        isHoliday: true,
        holidayName: 'MLK Day - No Classes'
    },
    '2025-01-21': {
        notes: [

        ],
        assignments: [

        ]
    },
    '2025-01-22': {
        notes: [

        ],
        assignments: [

        ]
    },

    // Week 2
    '2025-01-27': {
        notes: [

        ],
        assignments: [

        ]
    },
    '2025-01-31': {
        notes: [

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
