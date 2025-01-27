"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeeklySection } from '@/components/notes/WeeklySection';
import DailyGrid from '@/components/notes/DailyGrid';
import { Card } from '@/components/ui/card';
import { getCourseContent } from '@/lib/course-content';
import type { DayContent, WeekRange } from '@/types/notes';

interface NotesPageClientProps {
    term: string;
    courseId: string;
    courseName: string;
    courseCode: string;
    courseWeeks: WeekRange[];
}

// Helper to generate days for a week
function generateDaysForWeek(startDate: Date): { date: Date }[] {
    const days = [];
    const currentDate = new Date(startDate);

    // Ensure we start on Monday
    if (currentDate.getDay() === 0) { // If it's Sunday
        currentDate.setDate(currentDate.getDate() + 1); // Move to Monday
    }

    for (let i = 0; i < 4; i++) { // Generate Mon-Thu
        days.push({
            date: new Date(currentDate)
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
}

export function NotesPageClient({
    term,
    courseId,
    courseName,
    courseCode,
    courseWeeks
}: NotesPageClientProps) {
    const [courseContent, setCourseContent] = useState<Record<string, DayContent>>({});
    const [allExpanded, setAllExpanded] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(() => {
        // Initialize current week based on today's date
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Check if we're before the course starts
        if (todayStr < courseWeeks[0]?.start) {
            return -1; // No current week if course hasn't started
        }

        // Check if we're after the course ends
        if (todayStr > courseWeeks[courseWeeks.length - 1]?.end) {
            return -1; // No current week if course has ended
        }

        const weekIndex = courseWeeks?.findIndex(week =>
            todayStr >= week.start && todayStr <= week.end
        );
        return weekIndex >= 0 ? weekIndex : -1; // Return -1 if not in any week
    });

    // Use courseWeeks dates for generating the grid
    const weeks = courseWeeks.map(week => {
        const weekStartDate = new Date(week.start);
        const weekEndDate = new Date(week.end);

        return {
            startDate: weekStartDate,
            endDate: weekEndDate,
            days: generateDaysForWeek(weekStartDate)
        };
    });

    // Update current week based on date
    useEffect(() => {
        function updateCurrentWeek() {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];

            // Check course bounds
            if (todayStr < courseWeeks[0]?.start ||
                todayStr > courseWeeks[courseWeeks.length - 1]?.end) {
                setCurrentWeek(-1);
                return;
            }

            const weekIndex = courseWeeks?.findIndex(week =>
                todayStr >= week.start && todayStr <= week.end
            );
            setCurrentWeek(weekIndex >= 0 ? weekIndex : -1);
        }

        updateCurrentWeek(); // Run immediately
        const interval = setInterval(updateCurrentWeek, 1000 * 60 * 60);
        return () => clearInterval(interval);
    }, [courseWeeks]);

    // Fetch course content
    useEffect(() => {
        async function loadContent() {
            if (!term || !courseId) return;
            try {
                const content = await getCourseContent(term, courseId);
                setCourseContent(content || {});
            } catch (error) {
                console.error('Error loading course content:', error);
                setCourseContent({});
            }
        }
        loadContent();
    }, [term, courseId]);

    // Add null check for courseWeeks after hooks
    if (!courseWeeks) {
        console.error('Course weeks not loaded');
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-primary" />
                    {courseCode}: {courseName}
                </h1>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAllExpanded(!allExpanded)}
                    className="flex items-center gap-2"
                >
                    {allExpanded ? (
                        <>
                            <ChevronUp className="h-4 w-4" />
                            Collapse All
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-4 w-4" />
                            Expand All
                        </>
                    )}
                </Button>
            </div>

            {/* Introduction Card */}
            <Card className="p-4 bg-primary/5 border-primary/10">
                <p className="text-sm text-muted-foreground">
                    Welcome to the course calendar! Here you will find:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                    <li>Guided notes and completed notes for each section</li>
                    <li>Homework assignments and due dates</li>
                    <li>Links to online homework systems</li>
                    <li>Additional materials and resources</li>
                    <li>Important dates and announcements</li>
                </ul>
            </Card>

            {/* Weekly Sections */}
            <div className="space-y-3">
                {weeks.map((week, index) => (
                    <WeeklySection
                        key={index}
                        weekNumber={index + 1}
                        startDate={week.startDate}
                        endDate={week.endDate}
                        isCurrentWeek={currentWeek === index}
                        forceExpanded={allExpanded}
                    >
                        <DailyGrid
                            days={week.days}
                            courseContent={courseContent}
                            courseWeeks={courseWeeks}
                            currentWeek={currentWeek + 1}
                        />
                    </WeeklySection>
                ))}
            </div>
        </div>
    );
} 