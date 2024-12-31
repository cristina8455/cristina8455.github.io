// src/data/courses.ts
export interface Course {
    title: string;
    code: string;
    crn: string;
    schedule: string;
    location: string;
    dates: string;
    href: string;
    examDate?: string;
    examTime?: string;
    isOnline?: boolean;
}

export const currentCourses: Course[] = [
    {
        title: "College Algebra",
        code: "MTH 122-004",
        crn: "6315",
        schedule: "TuTh 10:00AM - 12:20PM",
        location: "TBA",
        dates: "Jan 21, 2025 - May 8, 2025",
        href: "mth122",
        examDate: "5/13/2025, Tuesday",
        examTime: "10:00AM - 11:50AM"
    },
    {
        title: "Precalculus",
        code: "MTH 144-005",
        crn: "6438",
        schedule: "MoWe 1:00PM - 3:20PM",
        location: "C173 - Grayslake Campus",
        dates: "Jan 22, 2025 - May 7, 2025",
        href: "mth144-005",
        examDate: "5/14/2025, Wednesday",
        examTime: "12:00PM - 1:50PM"
    },
    {
        title: "Precalculus Online",
        code: "MTH 144-202",
        crn: "6439",
        schedule: "Online Asynchronous",
        location: "ONLINE",
        dates: "Jan 21, 2025 - May 16, 2025",
        href: "mth144-202",
        isOnline: true
    }
];

export const currentTerm = "Spring 2025";