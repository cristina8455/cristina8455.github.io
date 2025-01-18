export type AssignmentType = 'homework' | 'quiz' | 'exam' | 'note' | 'resource' | 'other';

export interface Assignment {
    id: string;
    title: string;
    type: 'homework' | 'quiz' | 'exam';
    dueDate?: Date;
    dueTime?: string;
    link?: string;
    description?: string;
}

export type NoteType = {
    title: string;
    blank?: {
        url: string;
        label?: string;
    };
    completed?: {
        url: string;
        label?: string;
    };
    description?: string;
};

export interface DayContent {
    notes?: NoteType[];
    assignments?: Assignment[];
    isHoliday?: boolean;
    holidayName?: string;
}

export interface WeekData {
    startDate: Date;
    endDate: Date;
    days: DayContent[];
}

export interface CalendarDay {
    date: Date;
    content?: DayContent;
}

export interface CalendarWeek {
    startDate: Date;
    endDate: Date;
    days: CalendarDay[];
}

export interface CourseCalendar {
    termStart: Date;
    termEnd: Date;
    weeks: CalendarWeek[];
} 