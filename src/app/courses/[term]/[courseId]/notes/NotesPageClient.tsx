"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeeklySection } from '@/components/notes/WeeklySection';
import DailyGrid from '@/components/notes/DailyGrid';
import { Card } from '@/components/ui/card';
import { getCourseContent } from '@/lib/course-content';
import type { DayContent } from '@/types/notes';

interface NotesPageClientProps {
    term: string;
    courseId: string;
    courseName: string;
    courseCode: string;
    termStartDate: string;
}

// Helper to generate days for a week
function generateDaysForWeek(startDate: Date): { date: Date }[] {
    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 4; i++) {
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

    // Ensure we start on a Monday
    while (currentDate.getDay() !== 1) { // 1 is Monday
        currentDate.setDate(currentDate.getDate() - 1);
    }

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
    termStartDate
}: NotesPageClientProps) {
    const [courseContent, setCourseContent] = useState<Record<string, DayContent>>({});
    const [allExpanded, setAllExpanded] = useState(false);
    const [currentWeek, setCurrentWeek] = useState<number>(0);

    // Generate weeks
    const weeks = generateWeeks(new Date(termStartDate), 16);

    // Calculate current week
    useEffect(() => {
        const today = new Date();
        const currentWeekIndex = weeks.findIndex(week => {
            const weekStart = new Date(week.startDate);
            const weekEnd = new Date(week.endDate);
            return today >= weekStart && today <= weekEnd;
        });

        // If current date is found in a week, set that week
        // Otherwise, default to first week
        setCurrentWeek(currentWeekIndex >= 0 ? currentWeekIndex : 0);
    }, [weeks]);

    // Fetch course content
    useEffect(() => {
        async function loadContent() {
            if (!term || !courseId) {
                console.error('Missing required props:', { term, courseId });
                return;
            }

            console.log('Loading content for:', term, courseId);
            const content = await getCourseContent(term, courseId);
            console.log('Loaded content:', content);
            setCourseContent(content);
        }
        loadContent();
    }, [term, courseId]);

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
                        isCurrentWeek={index === currentWeek}
                        defaultExpanded={allExpanded || index === currentWeek}
                        forceExpanded={allExpanded}
                    >
                        <DailyGrid
                            days={week.days}
                            courseContent={courseContent}
                        />
                    </WeeklySection>
                ))}
            </div>
        </div>
    );
} 