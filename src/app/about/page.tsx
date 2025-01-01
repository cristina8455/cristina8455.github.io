// src/app/about/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Clock, ChevronRight } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-start gap-6">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">Cristina Sizemore</h2>
                            <p className="text-muted-foreground">
                                Mathematics and Statistics<br />
                                College of Lake County
                            </p>
                        </div>
                        <Image
                            src="/headshotCK.jpg"
                            alt="Cristina Sizemore"
                            width={120}
                            height={120}
                            className="rounded-lg object-cover shadow-md"
                        />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* About Section - Takes up 2 columns */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-card rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">About</h3>
                            <div className="prose text-muted-foreground space-y-4">
                                <p>
                                    I specialize in mathematics and statistics education, with a focus on making
                                    complex concepts accessible and meaningful to students. My teaching approach
                                    emphasizes practical applications and building a strong foundation for further
                                    study.
                                </p>
                                <p>
                                    With a background in statistical methodology, I bring real-world applications
                                    into the classroom to help students understand how mathematical concepts apply
                                    in various fields and careers.
                                </p>
                                <h4 className="text-base font-medium text-card-foreground mt-6 mb-2">Teaching Philosophy</h4>
                                <p>
                                    I believe in creating an inclusive learning environment where students feel
                                    comfortable asking questions and exploring mathematical concepts. My goal is
                                    to help students develop not just technical skills, but also critical thinking
                                    and problem-solving abilities that will serve them in their future studies and careers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section - Takes up 1 column */}
                    <div className="space-y-4">
                        <div className="bg-card rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <Mail className="text-primary mt-1 mr-2 flex-shrink-0" size={18} />
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-muted-foreground">csizemore@clcillinois.edu</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <MapPin className="text-primary mt-1 mr-2 flex-shrink-0" size={18} />
                                    <div>
                                        <p className="font-medium">Office Location</p>
                                        <p className="text-muted-foreground">Room C162<br />Building C, First Floor</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Clock className="text-primary mt-1 mr-2 flex-shrink-0" size={18} />
                                    <div>
                                        <p className="font-medium">Office Hours</p>
                                        <Link
                                            href="/office-hours"
                                            className="text-primary hover:text-primary/80 inline-flex items-center 
                                                     group text-sm mt-1 transition-colors duration-200"
                                        >
                                            View Schedule
                                            <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Current Courses Quick Link */}
                        <div className="bg-card rounded-lg shadow-sm p-4">
                            <Link
                                href="/courses"
                                className="text-primary hover:text-primary/80 flex items-center justify-between 
                                         group transition-colors duration-200"
                            >
                                <span>Current Courses</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}