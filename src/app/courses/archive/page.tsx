// src/app/courses/archive/page.tsx
import Link from 'next/link';
import { Archive, BookOpen, GraduationCap } from 'lucide-react';
import { getAllCourses, type Course, type DetailedCourse, type HistoricalCourse, currentTerm } from '@/data/courses';
import { Card, CardContent } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

// Type guard for DetailedCourse
function isDetailedCourse(course: Course): course is DetailedCourse {
    return course.type === 'detailed';
}

// Type guard for HistoricalCourse
function isHistoricalCourse(course: Course): course is HistoricalCourse {
    return course.type === 'historical';
}

// Helper to get year range from terms
function getYearRange(terms: Record<string, Course[]>): string {
    const years = Object.keys(terms).map(term => parseInt(term.split(' ')[1]));
    if (years.length === 0) return '';

    const start = Math.min(...years);
    const end = Math.max(...years);
    return `${start} – ${end}`;
}

// Helper to group courses by institution and term
function groupCoursesByInstitutionAndTerm(courses: HistoricalCourse[]) {
    return courses.reduce((acc, course) => {
        const instName = course.institution.name;
        const termName = course.term.name;

        if (!acc[instName]) {
            acc[instName] = {};
        }
        if (!acc[instName][termName]) {
            acc[instName][termName] = [];
        }

        acc[instName][termName].push(course);
        return acc;
    }, {} as Record<string, Record<string, HistoricalCourse[]>>);
}

export default function ArchivePage() {
    const allCourses = getAllCourses();
    const detailedCourses = allCourses.filter(
        (course): course is DetailedCourse =>
            isDetailedCourse(course) && course.term.name !== currentTerm.name
    );
    const historicalCourses = allCourses.filter(isHistoricalCourse);

    const groupedHistoricalCourses = groupCoursesByInstitutionAndTerm(historicalCourses);

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <h1 className="text-2xl font-bold flex items-center">
                            <Archive size={24} className="mr-3 text-primary" />
                            Course Archive
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Past courses and teaching history
                        </p>
                    </CardContent>
                </Card>

                {/* Recent Archived Courses */}
                {detailedCourses.length > 0 && (
                    <section className="mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <BookOpen size={20} className="mr-2 text-primary" />
                                    Recent Courses
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {detailedCourses.map((course) => (
                                        <Link
                                            key={`${course.term.slug}-${course.code}-${course.crn}`}
                                            href={`/courses/${course.term.slug}/${course.href}`}
                                            className="group block bg-card/50 rounded-lg border border-border p-4 
                                                     transition-all duration-200 
                                                     hover:shadow-md hover:border-primary/15
                                                     dark:hover:shadow-lg dark:hover:shadow-primary/5"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-grow">
                                                    <h3 className="text-lg font-medium text-card-foreground">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-primary/90 text-sm font-medium mt-1">
                                                        {course.code}
                                                    </p>
                                                    <p className="text-muted-foreground text-sm mt-1">
                                                        {course.schedule} | {course.location}
                                                    </p>
                                                </div>
                                                <p className="text-muted-foreground text-sm">
                                                    {course.term.name}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                )}

                {/* Historical Courses */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <GraduationCap size={20} className="mr-2 text-primary" />
                        Teaching History
                    </h2>

                    <Accordion type="single" collapsible className="space-y-4">
                        {Object.entries(groupedHistoricalCourses).map(([institutionName, terms]) => (
                            <AccordionItem
                                key={institutionName}
                                value={institutionName}
                                className="border rounded-lg bg-card px-6"
                            >
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex flex-col items-start">
                                        <h3 className="text-lg font-medium text-card-foreground">
                                            {institutionName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {getYearRange(terms)}
                                        </p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    {Object.entries(terms).map(([termName, courses]) => (
                                        <div key={`${institutionName}-${termName}`} className="mb-6 last:mb-0">
                                            <h4 className="text-sm font-medium text-muted-foreground mb-3">
                                                {termName}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {courses.map((course, index) => (
                                                    <Card
                                                        key={`${institutionName}-${termName}-${course.code}-${index}`}
                                                        className="bg-card/50 border-border/50"
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="space-y-1">
                                                                <h3 className="font-medium text-card-foreground">
                                                                    {course.title}
                                                                </h3>
                                                                <p className="text-primary/90 text-sm">
                                                                    {course.code}
                                                                </p>
                                                                <p className="text-muted-foreground text-sm">
                                                                    {course.role}
                                                                    {course.format && ` • ${course.format}`}
                                                                </p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>
            </main>
        </div>
    );
}