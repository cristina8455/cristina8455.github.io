import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DayContent } from '@/types/notes';

interface DailyGridProps {
    days: {
        date: Date;
        isHoliday?: boolean;
        holidayName?: string;
    }[];
    courseContent: Record<string, DayContent>;
}

function formatDateKey(date: Date): string {
    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function DailyGrid({ days, courseContent }: DailyGridProps) {
    return (
        <div>
            {/* Desktop View (4 columns) - Hidden on smaller screens */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-4">
                {days.map((day, index) => {
                    const dateKey = formatDateKey(day.date);
                    console.log('Date Key:', dateKey, 'Content:', courseContent[dateKey]); // Add this for debugging
                    const content = courseContent[dateKey];
                    const hasExam = content?.assignments?.some(a => a.type === 'exam');

                    return (
                        <Card key={index} className={cn(
                            "flex flex-col border-2",
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
                                                                    {assignment.title}
                                                                </h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Due: {assignment.dueTime}
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

                    return (
                        <Card key={index} className={cn(
                            "border-2",
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
                                                                    {assignment.title}
                                                                </h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Due: {assignment.dueTime}
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

                    return (
                        <Card key={index} className={cn(
                            "border-2",
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
                                                                    {assignment.title}
                                                                </h4>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Due: {assignment.dueTime}
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