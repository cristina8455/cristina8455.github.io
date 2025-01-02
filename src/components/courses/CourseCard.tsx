// src/components/courses/CourseCard.tsx
import Link from 'next/link';
import { ChevronRight, BookOpen } from 'lucide-react';
import { DetailedCourse, HistoricalCourse } from '@/data/courses';
import { Card, CardContent } from '@/components/ui/card';

interface CourseCardProps {
    course: DetailedCourse;
}

export function DetailedCourseCard({ course }: CourseCardProps) {
    const termSlug = course.term.slug;

    return (
        <Link href={`/courses/${termSlug}/${course.href}`}>
            <Card className="group transition-all duration-200 
                           hover:shadow-md hover:border-primary/15
                           dark:hover:shadow-lg dark:hover:shadow-primary/5">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-grow">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h2 className="text-xl font-semibold text-card-foreground">{course.title}</h2>
                                    <p className="text-primary font-medium">{course.code}</p>
                                </div>
                                <BookOpen size={20} className="text-primary flex-shrink-0 ml-4 opacity-90" />
                            </div>
                            <p className="text-muted-foreground mt-2">
                                {course.schedule} | {course.location}
                            </p>
                        </div>
                        <ChevronRight
                            size={20}
                            className="text-primary/80 ml-4 transform transition-all duration-200
                                     group-hover:translate-x-1 group-hover:text-primary"
                        />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

interface HistoricalCourseCardProps {
    course: HistoricalCourse;
}

export function HistoricalCourseCard({ course }: HistoricalCourseCardProps) {
    return (
        <Card className="group bg-card/50 border-border/50">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-medium text-card-foreground">{course.title}</h3>
                        <p className="text-primary/90 text-sm font-medium">{course.code}</p>
                        <p className="text-muted-foreground text-sm mt-1">
                            {course.role}
                            {course.format && ` • ${course.format}`}
                        </p>
                    </div>
                    <p className="text-muted-foreground text-sm">{course.term.name}</p>
                </div>
            </CardContent>
        </Card>
    );
}