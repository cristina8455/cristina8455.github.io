import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, Calendar, BookOpen } from 'lucide-react';

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
}

export default function CourseContent({ courseData }: CourseContentProps) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-foreground">{courseData.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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

            <div className="prose dark:prose-invert max-w-none 
                          prose-headings:text-foreground 
                          prose-p:text-foreground 
                          prose-strong:text-foreground 
                          [&_ul]:list-disc
                          [&_ul]:pl-6
                          [&_ul]:my-4
                          [&_li]:text-foreground
                          [&_li]:ml-4
                          prose-em:text-foreground/90
                          prose-a:text-primary
                          prose-a:no-underline
                          hover:prose-a:text-primary/90
                          prose-code:text-foreground
                          prose-pre:bg-muted
                          prose-pre:text-muted-foreground">
                <div dangerouslySetInnerHTML={{ __html: courseData.content }} />
            </div>
        </div>
    );
}