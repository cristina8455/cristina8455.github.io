import { COURSE_WEEKS } from '@/data/course-content/spring-2025/mth144-005';

export function getCurrentWeek(date: Date = new Date()): number {
    const todayStr = date.toISOString().split('T')[0];

    // For testing/preview, if date is before semester start, return 1
    if (todayStr < COURSE_WEEKS[0].start) return 1;

    const weekIndex = COURSE_WEEKS.findIndex(week =>
        todayStr >= week.start && todayStr <= week.end
    );

    console.log('getCurrentWeek:', {
        today: todayStr,
        weekIndex,
        returnValue: weekIndex >= 0 ? weekIndex + 1 : 1
    });

    // If we're in a week, return that week number, otherwise return 1
    return weekIndex >= 0 ? weekIndex + 1 : 1;
}

// We can remove getWeekDates as it's no longer needed 

export interface WeekRange {
    start: string;  // YYYY-MM-DD
    end: string;    // YYYY-MM-DD
}

export function generateCourseWeeks(semesterStart: string, semesterEnd: string): WeekRange[] {
    const weeks: WeekRange[] = [];
    const currentDate = new Date(semesterStart);
    const endDate = new Date(semesterEnd);

    while (currentDate <= endDate) {
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 3); // Add 3 days to get to Thursday

        weeks.push({
            start: weekStart.toISOString().split('T')[0],
            end: weekEnd.toISOString().split('T')[0]
        });

        // Move to next week's Monday
        currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
} 