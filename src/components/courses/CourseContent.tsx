"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Calendar, BookOpen } from 'lucide-react';
import QuickLinks from './QuickLinks';
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

            {/* Always show info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                                <h3 className="font-medium mb-0.5 text-foreground">Schedule</h3>
                                <p className="text-foreground/80">{courseData.schedule}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-primary" />
                            <div>
                                <h3 className="font-medium mb-0.5 text-foreground">Location</h3>
                                <p className="text-foreground/80">{courseData.location}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                                <h3 className="font-medium mb-0.5 text-foreground">Dates</h3>
                                <p className="text-foreground/80">{courseData.dates}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <div>
                                <h3 className="font-medium mb-0.5 text-foreground">Course Code</h3>
                                <p className="text-foreground/80">{courseData.code} (CRN: {courseData.crn})</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Links */}
            <QuickLinks courseSlug={courseSlug} />

            {/* Course Content */}
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
        </div>
    );
}