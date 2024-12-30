// src/app/courses/page.tsx
import Link from 'next/link';
import { ChevronRight, BookOpen, Archive, Clock } from 'lucide-react';
import { currentCourses, currentTerm } from '@/data/courses';

export default function CoursesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold flex items-center">
                            <Clock size={24} className="mr-3 text-blue-600" />
                            {currentTerm} Courses
                        </h1>
                        <Link
                            href="/courses/archive"
                            className="text-gray-600 hover:text-blue-600 flex items-center group"
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
                            href={course.href}
                            className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
                                            <p className="text-blue-600 font-medium">{course.code}</p>
                                        </div>
                                        <BookOpen size={20} className="text-blue-600 flex-shrink-0 ml-4" />
                                    </div>
                                    <p className="text-gray-600 mt-2">{course.schedule} | {course.location}</p>
                                </div>
                                <ChevronRight size={20} className="text-blue-600 ml-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}