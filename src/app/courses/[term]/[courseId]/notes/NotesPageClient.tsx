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
    termStartDate: string;
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

// Helper to generate weeks for the term
function generateWeeks(startDate: Date, numWeeks: number) {
    const weeks = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < numWeeks; i++) {
        const weekStartDate = new Date(currentDate);
        const weekEndDate = new Date(currentDate);
        weekEndDate.setDate(weekEndDate.getDate() + 3); // Mon-Thu

        weeks.push({
            startDate: weekStartDate,
            endDate: weekEndDate,
            days: generateDaysForWeek(weekStartDate)
        });

        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
}

export function NotesPageClient({
    term,
    courseId,
    courseName,
    courseCode,
    termStartDate,
    courseWeeks
}: NotesPageClientProps) {
    const [courseContent, setCourseContent] = useState<Record<string, DayContent>>({});
    const [allExpanded, setAllExpanded] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(0);

    // Update current week based on date
    useEffect(() => {
        function updateCurrentWeek() {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const weekIndex = courseWeeks?.findIndex(week =>
                todayStr >= week.start && todayStr <= week.end
            );
            setCurrentWeek(weekIndex >= 0 ? weekIndex : 0);
        }

        // Update immediately
        updateCurrentWeek();

        // Then update every hour
        const interval = setInterval(updateCurrentWeek, 1000 * 60 * 60);

        // Cleanup interval on unmount
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

    // Generate weeks
    const weeks = generateWeeks(new Date(termStartDate), courseWeeks.length);

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
                        startDate={new Date(courseWeeks[index]?.start)}
                        endDate={new Date(courseWeeks[index]?.end)}
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