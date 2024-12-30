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
            <h1 className="text-3xl font-bold mb-6">{courseData.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <div>
                                <h3 className="font-medium">Schedule</h3>
                                <p className="text-gray-600">{courseData.schedule}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <div>
                                <h3 className="font-medium">Location</h3>
                                <p className="text-gray-600">{courseData.location}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                                <h3 className="font-medium">Dates</h3>
                                <p className="text-gray-600">{courseData.dates}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <div>
                                <h3 className="font-medium">Course Code</h3>
                                <p className="text-gray-600">{courseData.code} (CRN: {courseData.crn})</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: courseData.content }} />
            </div>
        </div>
    );
}