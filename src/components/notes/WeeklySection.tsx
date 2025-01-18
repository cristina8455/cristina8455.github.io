"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WeeklySectionProps {
    weekNumber: number;
    startDate: Date;
    endDate: Date;
    children: React.ReactNode;
    isCurrentWeek?: boolean;
    defaultExpanded?: boolean;
    forceExpanded?: boolean;
}

export function WeeklySection({
    weekNumber,
    startDate,
    endDate,
    children,
    isCurrentWeek = false,
    defaultExpanded = false,
    forceExpanded = false
}: WeeklySectionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    useEffect(() => {
        if (forceExpanded !== undefined) {
            setIsExpanded(forceExpanded);
        }
    }, [forceExpanded]);

    const formattedDateRange = `${startDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
    })} - ${endDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
    })}`;

    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <Button
                variant="ghost"
                className={cn(
                    "w-full justify-between rounded-lg px-4 py-2 text-left font-medium",
                    !isExpanded && "hover:bg-accent hover:text-accent-foreground",
                    isExpanded && "bg-accent/50"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="flex items-center gap-2">
                    Week {weekNumber}
                    <span className="text-sm font-normal text-muted-foreground">
                        ({formattedDateRange})
                    </span>
                    {isCurrentWeek && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Current Week
                        </span>
                    )}
                </span>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </Button>
            {isExpanded && (
                <div className="p-4 pt-2">
                    {children}
                </div>
            )}
        </div>
    );
} 