"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeeklySectionProps {
    weekNumber: number;
    startDate: Date;
    endDate: Date;
    isCurrentWeek: boolean;
    forceExpanded?: boolean;
    children: React.ReactNode;
}

export function WeeklySection({
    weekNumber,
    startDate,
    endDate,
    isCurrentWeek,
    forceExpanded = false,
    children
}: WeeklySectionProps) {
    const [isExpanded, setIsExpanded] = useState(isCurrentWeek);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setIsExpanded(forceExpanded);
    }, [forceExpanded]);

    // Get the end of the week (Sunday) for the week label
    const weekEndDisplay = new Date(endDate);
    weekEndDisplay.setDate(weekEndDisplay.getDate() + 3); // Add 3 days to get to Sunday

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="rounded-lg border bg-card text-card-foreground">
            <div
                className={cn(
                    "flex items-center justify-between p-4 cursor-pointer",
                    isCurrentWeek && "bg-blue-50 dark:bg-blue-950/10"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    Week {weekNumber}
                    <span className="text-sm font-normal text-muted-foreground">
                        ({formatDate(startDate)} - {formatDate(weekEndDisplay)})
                    </span>
                    {isCurrentWeek && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                            Current Week
                        </span>
                    )}
                </h3>
                <ChevronDown
                    className={cn(
                        "h-5 w-5 text-muted-foreground/50 transition-transform",
                        isExpanded && "transform rotate-180"
                    )}
                />
            </div>
            {isExpanded && <div className="p-4 pt-0">{children}</div>}
        </div>
    );
} 