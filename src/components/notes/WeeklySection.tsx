"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WeeklySectionProps {
    weekNumber: number;
    startDate: Date;
    endDate: Date;
    isCurrentWeek: boolean;
    defaultExpanded?: boolean;
    forceExpanded?: boolean;
    children: React.ReactNode;
}

export function WeeklySection({
    weekNumber,
    startDate,
    endDate,
    isCurrentWeek,
    defaultExpanded = false,
    forceExpanded = false,
    children
}: WeeklySectionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    useEffect(() => {
        setIsExpanded(forceExpanded || defaultExpanded);
    }, [forceExpanded, defaultExpanded]);

    const formatDateRange = (start: Date, end: Date) => {
        return `${start.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        })} - ${end.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        })}`;
    };

    return (
        <div className={cn(
            "rounded-lg border shadow-sm",
            isCurrentWeek && "border-primary/50 bg-primary/5"
        )}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                    "flex w-full items-center justify-between px-4 py-3 rounded-t-lg transition-colors",
                    isCurrentWeek ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted",
                    isExpanded && "border-b"
                )}
            >
                <div className="flex items-center gap-2">
                    <h3 className={cn(
                        "font-semibold",
                        isCurrentWeek && "text-primary"
                    )}>
                        Week {weekNumber}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                        ({formatDateRange(startDate, endDate)})
                    </span>
                    {isCurrentWeek && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            Current Week
                        </span>
                    )}
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
            </button>
            {isExpanded && (
                <div className="p-4">
                    {children}
                </div>
            )}
        </div>
    );
} 