"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Calendar, BookOpen } from 'lucide-react';
import QuickLinks from './QuickLinks';
import { CompactOfficeHours } from '@/components/office-hours/CompactOfficeHours';
import { useIsInCanvas } from '@/utils/canvas';

interface CourseContentProps {
    courseData: {
        title: string;
        code: string;
        schedule: string;
        location: string;
        dates: string;
        crn: string;
        content: string;
    };
    courseSlug: string;
}

export default function CourseContent({ courseData, courseSlug }: CourseContentProps) {
    const isInCanvas = useIsInCanvas();

    return (
        <div className="max-w-4xl mx-auto">
            {/* Only show title when not in Canvas */}
            {!isInCanvas && (
                <h1 className="text-3xl font-bold mb-8 text-foreground">{courseData.title}</h1>
            )}

            {/* Course Introduction (when in Canvas) */}
            {isInCanvas && (
                <Card className="mb-6">
                    <CardContent className="p-4 sm:p-6">
                        <div className="prose dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: courseData.content }} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Info Cards - More compact in Canvas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <Card>
                    <CardContent className={`${isInCanvas ? 'p-3' : 'pt-6 p-6'}`}>
                        <div className="flex items-start space-x-3">
                            <Clock className="h-4 w-4 mt-0.5 text-primary" />
                            <div>
                                <h3 className="font-medium mb-0.5 text-foreground text-sm">Schedule</h3>
                                <p className="text-foreground/80 text-sm">{courseData.schedule}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className={`${isInCanvas ? 'p-3' : 'pt-6 p-6'}`}>
                        <div className="flex items-start space-x-3">
                            <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                            <div>
                                <h3 className="font-medium mb-0.5 text-foreground text-sm">Location</h3>
                                <p className="text-foreground/80 text-sm">{courseData.location}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className={`${isInCanvas ? 'p-3' : 'pt-6 p-6'}`}>
                        <div className="flex items-start space-x-3">
                            <Calendar className="h-4 w-4 mt-0.5 text-primary" />
                            <div>
                                <h3 className="font-medium mb-0.5 text-foreground text-sm">Dates</h3>
                                <p className="text-foreground/80 text-sm">{courseData.dates}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className={`${isInCanvas ? 'p-3' : 'pt-6 p-6'}`}>
                        <div className="flex items-start space-x-3">
                            <BookOpen className="h-4 w-4 mt-0.5 text-primary" />
                            <div>
                                <h3 className="font-medium mb-0.5 text-foreground text-sm">Course Code</h3>
                                <p className="text-foreground/80 text-sm">{courseData.code} (CRN: {courseData.crn})</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links */}
            <QuickLinks courseSlug={courseSlug} />

            {/* Office Hours (only in Canvas) */}
            {isInCanvas && (
                <Card className="mb-6">
                    <CardContent className="p-4 sm:p-6">
                        <CompactOfficeHours showFullLocationDetails={true} />
                    </CardContent>
                </Card>
            )}

            {/* Course Content (when not in Canvas) */}
            {!isInCanvas && (
                <Card className="mb-8">
                    <CardContent className="p-6 sm:p-8">
                        <div className="prose dark:prose-invert max-w-none
                                    prose-headings:font-semibold 
                                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                                    prose-p:text-foreground/90 prose-p:leading-relaxed
                                    prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                                    prose-li:text-foreground/90 prose-li:my-2
                                    prose-strong:text-foreground prose-strong:font-semibold
                                    prose-a:text-primary hover:prose-a:opacity-80
                                    prose-code:text-foreground/90 prose-code:bg-muted/50 prose-code:px-1 prose-code:rounded
                                    prose-pre:bg-muted prose-pre:text-muted-foreground
                                    [&>*:first-child]:mt-0">
                            <div dangerouslySetInnerHTML={{ __html: courseData.content }} />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}