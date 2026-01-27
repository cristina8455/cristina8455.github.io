// src/app/page.tsx
import Image from 'next/image';
import { Clock, ChevronRight, MapPin, BookOpen, Archive } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { getCurrentCourses, type Course } from '@/lib/courses';

// ISR: revalidate every 24 hours
export const revalidate = 86400;

export default async function Home() {
  const courses = await getCurrentCourses();

  // Get the term name from the first course (they should all be same term)
  const currentTermName = courses[0]?.term?.name || 'Current';

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6 flex items-center justify-between">
          <div className="pr-6">
            <h2 className="text-2xl font-bold mb-1 text-card-foreground">Mathematics & Statistics</h2>
            <p className="text-muted-foreground text-sm">College of Lake County</p>
          </div>
          <Image
            src="/headshotCK.jpg"
            alt="Cristina Sizemore"
            width={80}
            height={80}
            className="rounded-lg object-cover shadow-md hover:shadow-lg transition-shadow duration-200"
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold flex items-center text-card-foreground">
              <Clock size={18} className="mr-2 text-primary opacity-90" />
              {currentTermName} Courses
            </h3>
            <Link
              href="/courses"
              className="text-sm text-muted-foreground hover:text-primary flex items-center group
                       transition-colors duration-200"
            >
              <Archive size={16} className="mr-1 opacity-70 group-hover:opacity-100" />
              All Courses
            </Link>
          </div>

          {courses.length === 0 ? (
            <p className="text-muted-foreground">No current courses.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <QuickInfoCard
            icon={MapPin}
            title="Contact & Location"
            content={<>
              <p>Office: Room C162</p>
              <p>csizemore@clcillinois.edu</p>
            </>}
            linkText="More Details"
            href="/about"
          />

          <QuickInfoCard
            icon={BookOpen}
            title="Background"
            content="Mathematics and statistics instructor with research background in statistical methodology."
            linkText="Learn More"
            href="/about"
          />
        </div>
      </main>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const href = `/courses/${course.term?.slug}/${course.slug}`;

  return (
    <Link
      href={href}
      aria-label={`View details for ${course.code} - ${course.name}`}
    >
      <div className="bg-card rounded-lg border border-border p-4
                      transition-all duration-200
                      hover:shadow-md hover:border-primary/15
                      hover:translate-y-[-2px]
                      dark:hover:shadow-lg dark:hover:shadow-primary/5
                      group cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium mb-1 text-card-foreground">{course.name}</h4>
            <p className="text-sm text-muted-foreground">{course.code}</p>
          </div>
          <BookOpen size={16} className="text-primary opacity-80 flex-shrink-0 ml-2
                                       group-hover:opacity-100 transition-opacity duration-200" />
        </div>
        <div
          className="text-sm text-primary group-hover:text-primary/80
                     inline-flex items-center transition-colors duration-200"
        >
          View Details
          <ChevronRight
            size={14}
            className="ml-1 transform group-hover:translate-x-1
                       transition-transform duration-200"
          />
        </div>
      </div>
    </Link>
  );
}

function QuickInfoCard({
  icon: Icon,
  title,
  content,
  linkText,
  href
}: {
  icon: LucideIcon;
  title: string;
  content: React.ReactNode;
  linkText: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${linkText} about ${title}`}
    >
      <div className="bg-card rounded-lg border border-border p-4
                      transition-all duration-200
                      hover:shadow-md hover:border-primary/15
                      hover:translate-y-[-2px]
                      dark:hover:shadow-lg dark:hover:shadow-primary/5
                      group cursor-pointer">
        <div className="flex items-start">
          <Icon size={16} className="text-primary opacity-90 mt-1 mr-2 flex-shrink-0
                                   group-hover:opacity-100 transition-opacity duration-200" />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium mb-1 text-card-foreground">{title}</h3>
            <div className="text-sm text-muted-foreground">
              {content}
              <div className="text-primary group-hover:text-primary/80
                          inline-flex items-center group mt-2
                          transition-colors duration-200">
                {linkText}
                <ChevronRight
                  size={14}
                  className="ml-1 transform group-hover:translate-x-1
                            transition-transform duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
