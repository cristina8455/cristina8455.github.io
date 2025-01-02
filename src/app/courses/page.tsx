// src/app/courses/page.tsx
import Link from 'next/link';
import { ChevronRight, BookOpen, Archive, Clock } from 'lucide-react';
import { currentCourses, currentTerm } from '@/data/courses';

export default function CoursesPage() {
    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold flex items-center">
                            <Clock size={24} className="mr-3 text-primary" />
                            {currentTerm.name} Courses
                        </h1>
                        <Link
                            href="/courses/archive"
                            className="text-muted-foreground hover:text-primary flex items-center group transition-colors duration-200"
                        >
                            <Archive size={20} className="mr-2" />
                            Past Courses
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {currentCourses.map((course) => (
                        <Link
                            key={course.code}
                            href={`/courses/${course.term.slug}/${course.href}`}
                            className="group block bg-card rounded-lg border border-border p-6 
                                     transition-all duration-200 
                                     hover:shadow-md hover:border-primary/15
                                     dark:hover:shadow-lg dark:hover:shadow-primary/5"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h2 className="text-xl font-semibold text-card-foreground">{course.title}</h2>
                                            <p className="text-primary font-medium">{course.code}</p>
                                        </div>
                                        <BookOpen size={20} className="text-primary flex-shrink-0 ml-4 opacity-90" />
                                    </div>
                                    <p className="text-muted-foreground mt-2">{course.schedule} | {course.location}</p>
                                </div>
                                <ChevronRight
                                    size={20}
                                    className="text-primary/80 ml-4 transform transition-all duration-200
                                             group-hover:translate-x-1 group-hover:text-primary"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}