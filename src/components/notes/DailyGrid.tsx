import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DayContent, WeekRange } from '@/types/notes';

interface DailyGridProps {
    days: {
        date: Date;
        isHoliday?: boolean;
        holidayName?: string;
    }[];
    courseContent: Record<string, DayContent>;
    courseWeeks: WeekRange[];
    currentWeek: number;
}

function formatDateKey(date: Date): string {
    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Helper function to format the due date
function formatDueDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

export default function DailyGrid({ days, courseContent = {}, courseWeeks, currentWeek }: DailyGridProps) {
    console.log('DailyGrid render:', {
        days: days.map(d => d.date.toISOString().split('T')[0]),
        courseContent,
        currentWeek,
        courseWeeks
    });

    const isCurrentWeek = (date: Date) => {
        if (!currentWeek || !courseWeeks[currentWeek - 1]) {
            console.log('Invalid current week or course weeks:', { currentWeek, courseWeeks });
            return false;
        }

        const dateStr = date.toISOString().split('T')[0];
        const weekRange = courseWeeks[currentWeek - 1];

        console.log('Checking if date is in current week:', {
            dateStr,
            weekRange,
            currentWeek
        });

        const isInWeek = dateStr >= weekRange.start && dateStr <= weekRange.end;
        console.log('Is in current week:', isInWeek);

        return isInWeek;
    };

    // Add null check for days
    if (!days) {
        console.error('Days array is undefined');
        return null;
    }

    return (
        <div>
            {/* Desktop View (4 columns) - Hidden on smaller screens */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-4">
                {days.map((day, index) => {
                    const dateKey = formatDateKey(day.date);
                    // Provide empty default if courseContent[dateKey] is undefined
                    const content = courseContent?.[dateKey] || null;
                    const hasExam = content?.assignments?.some(a => a.type === 'exam');
                    const isThisWeek = isCurrentWeek(day.date);

                    return (
                        <Card key={index} className={cn(
                            "flex flex-col border-2",
                            isThisWeek && "ring-2 ring-blue-400 dark:ring-blue-600",
                            content?.isHoliday && "bg-purple-50 border-purple-200 dark:bg-purple-950/10 dark:border-purple-900",
                            hasExam && "bg-red-50 border-red-200 dark:bg-red-950/10 dark:border-red-900",
                            (!content?.isHoliday && !hasExam) && "border-border"
                        )}>
                            <div className={cn(
                                "p-3 border-b",
                                content?.isHoliday && "bg-purple-100/50 dark:bg-purple-950/20",
                                hasExam && "bg-red-100/50 dark:bg-red-950/20",
                                (!content?.isHoliday && !hasExam) && "bg-muted/50"
                            )}>
                                <div className="font-medium">
                                    {day.date.toLocaleDateString('en-US', { weekday: 'long' })}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {day.date.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                            <div className="p-3 flex-1 space-y-3 text-sm">
                                {content?.isHoliday ? (
                                    <p className="italic text-muted-foreground">
                                        {content.holidayName || 'No Classes'}
                                    </p>
                                ) : content ? (
                                    <>
                                        {content.notes && content.notes.length > 0 && (
                                            <div className="space-y-2">
                                                {content.notes.map((note, idx) => (
                                                    <div key={idx} className="space-y-1">
                                                        <h4 className="font-medium text-primary">
                                                            {note.title}
                                                        </h4>
                                                        <div className="flex gap-2 text-xs">
                                                            {note.blank && (
                                                                <a href={note.blank.url}
                                                                    className="text-blue-500 hover:underline">
                                                                    {note.blank.label || 'Blank Notes'}
                                                                </a>
                                                            )}
                                                            {note.completed && (
                                                                <a href={note.completed.url}
                                                                    className="text-blue-500 hover:underline">
                                                                    {note.completed.label || 'Completed Notes'}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {content.assignments && content.assignments.length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-border/50">
                                                {content.assignments.map((assignment, idx) => (
                                                    <div key={idx} className="space-y-1">
                                                        <div className="flex items-start gap-2">
                                                            <span className={cn(
                                                                "mt-0.5 w-2 h-2 rounded-full",
                                                                assignment.type === 'homework' && "bg-blue-500",
                                                                assignment.type === 'quiz' && "bg-green-500",
                                                                assignment.type === 'exam' && "bg-red-500"
                                                            )} />
                                                            <div>
                                                                <h4 className="font-medium">
                                                                    {assignment.link ? (
                                                                        <a
                                                                            href={assignment.link}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-primary hover:underline"
                                                                        >
                                                                            {assignment.title}
                                                                        </a>
                                                                    ) : (
                                                                        assignment.title
                                                                    )}
                                                                </h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Due: {formatDueDate(assignment.dueDate)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        No content for this date
                                    </p>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Tablet View (2x2 grid) - Hidden on mobile and desktop */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:hidden gap-4">
                {days.map((day, index) => {
                    const dateKey = formatDateKey(day.date);
                    const content = courseContent[dateKey];
                    const hasExam = content?.assignments?.some(a => a.type === 'exam');
                    const isThisWeek = isCurrentWeek(day.date);

                    return (
                        <Card key={index} className={cn(
                            "border-2",
                            isThisWeek && "ring-2 ring-blue-400 dark:ring-blue-600",
                            content?.isHoliday && "bg-purple-50 border-purple-200 dark:bg-purple-950/10 dark:border-purple-900",
                            hasExam && "bg-red-50 border-red-200 dark:bg-red-950/10 dark:border-red-900",
                            (!content?.isHoliday && !hasExam) && "border-border"
                        )}>
                            <div className={cn(
                                "p-3 border-b",
                                content?.isHoliday && "bg-purple-100/50 dark:bg-purple-950/20",
                                hasExam && "bg-red-100/50 dark:bg-red-950/20",
                                (!content?.isHoliday && !hasExam) && "bg-muted/50"
                            )}>
                                <div className="font-medium">
                                    {day.date.toLocaleDateString('en-US', { weekday: 'long' })}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {day.date.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                            <div className="p-3 flex-1 space-y-3 text-sm">
                                {content?.isHoliday ? (
                                    <p className="italic text-muted-foreground">
                                        {content.holidayName || 'No Classes'}
                                    </p>
                                ) : content ? (
                                    <>
                                        {content.notes && content.notes.length > 0 && (
                                            <div className="space-y-2">
                                                {content.notes.map((note, idx) => (
                                                    <div key={idx} className="space-y-1">
                                                        <h4 className="font-medium text-primary">
                                                            {note.title}
                                                        </h4>
                                                        <div className="flex gap-2 text-xs">
                                                            {note.blank && (
                                                                <a href={note.blank.url}
                                                                    className="text-blue-500 hover:underline">
                                                                    {note.blank.label || 'Blank Notes'}
                                                                </a>
                                                            )}
                                                            {note.completed && (
                                                                <a href={note.completed.url}
                                                                    className="text-blue-500 hover:underline">
                                                                    {note.completed.label || 'Completed Notes'}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {content.assignments && content.assignments.length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-border/50">
                                                {content.assignments.map((assignment, idx) => (
                                                    <div key={idx} className="space-y-1">
                                                        <div className="flex items-start gap-2">
                                                            <span className={cn(
                                                                "mt-0.5 w-2 h-2 rounded-full",
                                                                assignment.type === 'homework' && "bg-blue-500",
                                                                assignment.type === 'quiz' && "bg-green-500",
                                                                assignment.type === 'exam' && "bg-red-500"
                                                            )} />
                                                            <div>
                                                                <h4 className="font-medium">
                                                                    {assignment.link ? (
                                                                        <a
                                                                            href={assignment.link}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-primary hover:underline"
                                                                        >
                                                                            {assignment.title}
                                                                        </a>
                                                                    ) : (
                                                                        assignment.title
                                                                    )}
                                                                </h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Due: {formatDueDate(assignment.dueDate)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        No content for this date
                                    </p>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Mobile View (single column) - Hidden on larger screens */}
            <div className="sm:hidden space-y-4">
                {days.map((day, index) => {
                    const dateKey = formatDateKey(day.date);
                    const content = courseContent[dateKey];
                    const hasExam = content?.assignments?.some(a => a.type === 'exam');
                    const isThisWeek = isCurrentWeek(day.date);

                    return (
                        <Card key={index} className={cn(
                            "border-2",
                            isThisWeek && "ring-2 ring-blue-400 dark:ring-blue-600",
                            content?.isHoliday && "bg-purple-50 border-purple-200 dark:bg-purple-950/10 dark:border-purple-900",
                            hasExam && "bg-red-50 border-red-200 dark:bg-red-950/10 dark:border-red-900",
                            (!content?.isHoliday && !hasExam) && "border-border"
                        )}>
                            <div className={cn(
                                "p-3 border-b",
                                content?.isHoliday && "bg-purple-100/50 dark:bg-purple-950/20",
                                hasExam && "bg-red-100/50 dark:bg-red-950/20",
                                (!content?.isHoliday && !hasExam) && "bg-muted/50"
                            )}>
                                <div className="font-medium">
                                    {day.date.toLocaleDateString('en-US', { weekday: 'long' })}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {day.date.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                            <div className="p-3 flex-1 space-y-3 text-sm">
                                {content?.isHoliday ? (
                                    <p className="italic text-muted-foreground">
                                        {content.holidayName || 'No Classes'}
                                    </p>
                                ) : content ? (
                                    <>
                                        {content.notes && content.notes.length > 0 && (
                                            <div className="space-y-2">
                                                {content.notes.map((note, idx) => (
                                                    <div key={idx} className="space-y-1">
                                                        <h4 className="font-medium text-primary">
                                                            {note.title}
                                                        </h4>
                                                        <div className="flex gap-2 text-xs">
                                                            {note.blank && (
                                                                <a href={note.blank.url}
                                                                    className="text-blue-500 hover:underline">
                                                                    {note.blank.label || 'Blank Notes'}
                                                                </a>
                                                            )}
                                                            {note.completed && (
                                                                <a href={note.completed.url}
                                                                    className="text-blue-500 hover:underline">
                                                                    {note.completed.label || 'Completed Notes'}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {content.assignments && content.assignments.length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-border/50">
                                                {content.assignments.map((assignment, idx) => (
                                                    <div key={idx} className="space-y-1">
                                                        <div className="flex items-start gap-2">
                                                            <span className={cn(
                                                                "mt-0.5 w-2 h-2 rounded-full",
                                                                assignment.type === 'homework' && "bg-blue-500",
                                                                assignment.type === 'quiz' && "bg-green-500",
                                                                assignment.type === 'exam' && "bg-red-500"
                                                            )} />
                                                            <div>
                                                                <h4 className="font-medium">
                                                                    {assignment.link ? (
                                                                        <a
                                                                            href={assignment.link}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-primary hover:underline"
                                                                        >
                                                                            {assignment.title}
                                                                        </a>
                                                                    ) : (
                                                                        assignment.title
                                                                    )}
                                                                </h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Due: {formatDueDate(assignment.dueDate)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        No content for this date
                                    </p>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
} 