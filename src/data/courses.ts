// src/data/courses.ts

export type Institution = {
    name: string;
    shortName: string;  // For display in compact views
    years: string;      // e.g., "2021 - present" or "2015 - 2021"
};

export type Term = {
    name: string;       // e.g., "Spring 2025"
    slug: string;       // e.g., "spring-2025"
    startDate: string;  // Used for sorting
    endDate: string;    // Used for sorting
};

// Base interface for all course types
interface BaseCourse {
    title: string;
    code: string;
    institution: Institution;
    term: Term;
}

// Current/Recent courses with full details
export interface DetailedCourse extends BaseCourse {
    type: 'detailed';
    crn: string;
    schedule: string;
    location: string;
    dates: string;
    href: string;
    examDate?: string;
    examTime?: string;
    isOnline?: boolean;
    hasContent: true;    // Will always have content
}

// Historical courses with basic info
export interface HistoricalCourse extends BaseCourse {
    type: 'historical';
    role: string;        // e.g., "Instructor", "TA", "Online Instructor"
    format?: string;     // e.g., "Online", "Flipped", etc.
    hasContent: false;   // Will never have content
}

// Union type for all course types
export type Course = DetailedCourse | HistoricalCourse;

export const institutions: Institution[] = [
    {
        name: "College of Lake County",
        shortName: "CLC",
        years: "2024 - present"
    },
    {
        name: "Northwestern University",
        shortName: "NU",
        years: "2021 - 2023"
    },
    {
        name: "University of Florida",
        shortName: "UF",
        years: "2015 - 2021"
    },
    {
        name: "Santa Fe College",
        shortName: "SFC",
        years: "2016 - 2021"
    },
    {
        name: "Warren Wilson College",
        shortName: "WWC",
        years: "2013 - 2015"
    },
    {
        name: "Western Carolina University",
        shortName: "WCU",
        years: "2012 - 2015"
    }
];

// Helper function to create term objects
const createTerm = (name: string): Term => {
    const [season, year] = name.split(' ');

    const startDates: Record<string, string> = {
        'Spring': '01-01',
        'Summer': '05-01',
        'Fall': '08-01'
    };

    const endDates: Record<string, string> = {
        'Spring': '05-31',
        'Summer': '07-31',
        'Fall': '12-31'
    };

    if (!(season in startDates) || !year) {
        throw new Error(`Invalid term format: ${name}. Expected format: "Season Year" where Season is Spring, Summer, or Fall`);
    }

    return {
        name,
        slug: name.toLowerCase().replace(' ', '-'),
        startDate: `${year}-${startDates[season]}`,
        endDate: `${year}-${endDates[season]}`
    };
};

export const currentTerm: Term = {
    name: "Spring 2025",
    slug: "spring-2025",
    startDate: "2025-01-21",
    endDate: "2025-05-16"
};

// Current courses remain the same as in your existing courses.ts
export const currentCourses: DetailedCourse[] = [
    {
        type: 'detailed',
        title: "College Algebra",
        code: "MTH 122-004",
        institution: institutions[0], // CLC
        term: currentTerm,
        crn: "6315",
        schedule: "TuTh 10:00AM - 12:20PM",
        location: "TBA",
        dates: "Jan 21, 2025 - May 8, 2025",
        href: "mth122",
        examDate: "5/13/2025, Tuesday",
        examTime: "10:00AM - 11:50AM",
        hasContent: true
    },
    {
        type: 'detailed',
        title: "Precalculus",
        code: "MTH 144-005",
        institution: institutions[0],
        term: currentTerm,
        crn: "6438",
        schedule: "MoWe 1:00PM - 3:20PM",
        location: "C173 - Grayslake Campus",
        dates: "Jan 22, 2025 - May 7, 2025",
        href: "mth144-005",
        examDate: "5/14/2025, Wednesday",
        examTime: "12:00PM - 1:50PM",
        hasContent: true
    },
    {
        type: 'detailed',
        title: "Precalculus Online",
        code: "MTH 144-202",
        institution: institutions[0],
        term: currentTerm,
        crn: "6439",
        schedule: "Online Asynchronous",
        location: "ONLINE",
        dates: "Jan 21, 2025 - May 16, 2025",
        href: "mth144-202",
        isOnline: true,
        hasContent: true
    }
];

export const archivedDetailedCourses: DetailedCourse[] = [
    // This will be populated as current courses are archived
];

export const historicalCourses: HistoricalCourse[] = [
    // Northwestern University
    {
        type: 'historical',
        title: "Single-Variable Calculus with Precalculus",
        code: "Math 218-1",
        institution: institutions[1],
        term: createTerm("Fall 2021"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Single-Variable Differential Calculus",
        code: "Math 220-1",
        institution: institutions[1],
        term: createTerm("Fall 2021"),
        role: "Instructor",
        hasContent: false
    },

    // University of Florida
    {
        type: 'historical',
        title: "Analytic Geometry and Calculus 3",
        code: "MAC 2313",
        institution: institutions[2],
        term: createTerm("Spring 2021"),
        role: "Online TA",
        format: "Online",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Linear Algebra",
        code: "MAS 4105",
        institution: institutions[2],
        term: createTerm("Fall 2020"),
        role: "TA",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Elementary Differential Equations",
        code: "MAP2302",
        institution: institutions[2],
        term: createTerm("Summer 2020"),
        role: "Online Instructor",
        format: "Online",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Intermediate Differential Equations",
        code: "MAP4305/5304",
        institution: institutions[2],
        term: createTerm("Summer 2020"),
        role: "Grader",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Introduction to Numerical Analysis",
        code: "MAD 4401",
        institution: institutions[2],
        term: createTerm("Spring 2020"),
        role: "Guest Lecturer",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Analytic Geometry and Calculus 2",
        code: "MAC 2312",
        institution: institutions[2],
        term: createTerm("Spring 2020"),
        role: "Instructor",
        format: "Flipped",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Survey of Calculus 1",
        code: "MAC 2233",
        institution: institutions[2],
        term: createTerm("Fall 2019"),
        role: "Online TA",
        format: "Online",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Analytic Geometry and Calculus 2",
        code: "MAC 2312",
        institution: institutions[2],
        term: createTerm("Fall 2019"),
        role: "Online TA",
        format: "Online",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Survey of Calculus 1",
        code: "MAC 2233",
        institution: institutions[2],
        term: createTerm("Summer 2019"),
        role: "Online Instructor",
        format: "Online",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Calculus 3",
        code: "MAC 2313",
        institution: institutions[2],
        term: createTerm("Spring 2019"),
        role: "TA",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Trigonometry",
        code: "MAC 1114",
        institution: institutions[2],
        term: createTerm("Fall 2018"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Survey of Calculus 2",
        code: "MAC 2234",
        institution: institutions[2],
        term: createTerm("Summer 2018"),
        role: "Online Instructor",
        format: "Online",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Analytic Geometry and Calculus 2",
        code: "MAC 2312",
        institution: institutions[2],
        term: createTerm("Spring 2018"),
        role: "TA",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Basic College Algebra",
        code: "MAC 1105",
        institution: institutions[2],
        term: createTerm("Spring 2018"),
        role: "Online TA",
        format: "Online",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Precalculus Algebra",
        code: "MAC 1140",
        institution: institutions[2],
        term: createTerm("Fall 2017"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Basic College Algebra",
        code: "MAC 1105",
        institution: institutions[2],
        term: createTerm("Fall 2017"),
        role: "Online TA",
        format: "Online",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Basic College Algebra",
        code: "MAC 1105",
        institution: institutions[2],
        term: createTerm("Summer 2017"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Survey of Calculus 2",
        code: "MAC 2234",
        institution: institutions[2],
        term: createTerm("Summer 2017"),
        role: "Online TA",
        format: "Online",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Calculus 1",
        code: "MAC 2311",
        institution: institutions[2],
        term: createTerm("Spring 2017"),
        role: "TA",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Precalculus Algebra and Trig",
        code: "MAC 1147",
        institution: institutions[2],
        term: createTerm("Fall 2016"),
        role: "TA",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Trigonometry",
        code: "MAC 1114",
        institution: institutions[2],
        term: createTerm("Summer 2016"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Basic College Algebra",
        code: "MAC 1105",
        institution: institutions[2],
        term: createTerm("Spring 2016"),
        role: "TA",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Basic College Algebra",
        code: "MAC 1105",
        institution: institutions[2],
        term: createTerm("Fall 2015"),
        role: "TA",
        hasContent: false
    },

    // Santa Fe College
    {
        type: 'historical',
        title: "College Algebra",
        code: "MAC 1105",
        institution: institutions[3],
        term: createTerm("Fall 2020"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "College Algebra",
        code: "MAC 1105",
        institution: institutions[3],
        term: createTerm("Spring 2020"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Precalculus Algebra",
        code: "MAC 1140",
        institution: institutions[3],
        term: createTerm("Spring 2020"),
        role: "Online Instructor",
        format: "Online",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Precalculus Algebra",
        code: "MAC 1140",
        institution: institutions[3],
        term: createTerm("Summer 2020"),
        role: "Online Instructor",
        format: "Online",
        hasContent: false
    },

    // Warren Wilson College
    {
        type: 'historical',
        title: "Statistics",
        code: "Statistics",
        institution: institutions[4],
        term: createTerm("Summer 2015"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Statistics",
        code: "Statistics",
        institution: institutions[4],
        term: createTerm("Spring 2015"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Precalculus Algebra",
        code: "Precalculus Algebra",
        institution: institutions[4],
        term: createTerm("Spring 2015"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Statistics",
        code: "Statistics",
        institution: institutions[4],
        term: createTerm("Fall 2014"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Precalculus Algebra",
        code: "Precalculus Algebra",
        institution: institutions[4],
        term: createTerm("Fall 2014"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Statistics",
        code: "Statistics",
        institution: institutions[4],
        term: createTerm("Spring 2014"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Statistics",
        code: "Statistics",
        institution: institutions[4],
        term: createTerm("Fall 2013"),
        role: "Instructor",
        hasContent: false
    },

    // Western Carolina University
    {
        type: 'historical',
        title: "Applied Statistics",
        code: "Math 170",
        institution: institutions[5],
        term: createTerm("Spring 2015"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Mathematical Concepts",
        code: "Math 101",
        institution: institutions[5],
        term: createTerm("Spring 2015"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "College Algebra",
        code: "Math 130",
        institution: institutions[5],
        term: createTerm("Fall 2014"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Mathematical Concepts",
        code: "Math 101",
        institution: institutions[5],
        term: createTerm("Fall 2014"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Applied Statistics",
        code: "Math 170",
        institution: institutions[5],
        term: createTerm("Spring 2013"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Single-Variable Differential Calculus",
        code: "Math 220-1",
        institution: institutions[1],
        term: createTerm("Fall 2021"),
        role: "Instructor",
        hasContent: false
    },

    // University of Florida
    {
        type: 'historical',
        title: "Analytic Geometry and Calculus 3",
        code: "MAC 2313",
        institution: institutions[2],
        term: createTerm("Spring 2021"),
        role: "Online TA",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Linear Algebra",
        code: "MAS 4105",
        institution: institutions[2],
        term: createTerm("Fall 2020"),
        role: "TA",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Elementary Differential Equations",
        code: "MAP2302",
        institution: institutions[2],
        term: createTerm("Summer 2020"),
        role: "Online Instructor",
        hasContent: false
    },
    // ... [Additional UF courses would go here]

    // Santa Fe College
    {
        type: 'historical',
        title: "College Algebra",
        code: "MAC 1105",
        institution: institutions[3],
        term: createTerm("Fall 2020"),
        role: "Instructor",
        hasContent: false
    },
    {
        type: 'historical',
        title: "Precalculus Algebra",
        code: "MAC 1140",
        institution: institutions[3],
        term: createTerm("Summer 2020"),
        role: "Online Instructor",
        format: "Online",
        hasContent: false
    },
    // ... [Additional Santa Fe courses would go here]

    // Warren Wilson College
    {
        type: 'historical',
        title: "Statistics",
        code: "MAT 141",
        institution: institutions[4],
        term: createTerm("Spring 2015"),
        role: "Instructor",
        hasContent: false
    },
    // ... [Additional Warren Wilson courses would go here]

    // Western Carolina University
    {
        type: 'historical',
        title: "Applied Statistics",
        code: "Math 170",
        institution: institutions[5],
        term: createTerm("Spring 2015"),
        role: "Instructor",
        hasContent: false
    }
    // ... [Additional WCU courses would go here]
];

// Helper functions remain the same
export function getAllCourses(): Course[] {
    return [
        ...currentCourses,
        ...archivedDetailedCourses,
        ...historicalCourses
    ].sort((a, b) => {
        return new Date(b.term.startDate).getTime() - new Date(a.term.startDate).getTime();
    });
}

export function getCoursesByInstitution(institutionName: string): Course[] {
    return getAllCourses().filter(course => course.institution.name === institutionName);
}

export function getCoursesByTerm(termSlug: string): Course[] {
    return getAllCourses().filter(course => course.term.slug === termSlug);
}