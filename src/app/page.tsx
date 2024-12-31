// src/app/page.tsx
import Image from 'next/image';
import { Clock, ChevronRight, MapPin, BookOpen, Archive } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { currentCourses, currentTerm } from '@/data/courses';

export default function Home() {
  const termSlug = currentTerm.toLowerCase().replace(' ', '-');

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex items-center justify-between">
          <div className="pr-6">
            <h2 className="text-2xl font-bold mb-1">Mathematics & Statistics</h2>
            <p className="text-gray-600 text-sm">College of Lake County</p>
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
            <h3 className="text-lg font-semibold flex items-center">
              <Clock size={18} className="mr-2 text-blue-600" />
              {currentTerm} Courses
            </h3>
            <Link
              href="/courses/archive"
              className="text-sm text-gray-600 hover:text-blue-600 flex items-center group"
            >
              <Archive size={16} className="mr-1" />
              Past Courses
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentCourses.map((course) => (
              <CourseCard
                key={course.code}
                title={course.title}
                code={course.code}
                description={`${course.schedule}${course.location !== 'ONLINE' ? ` (${course.location})` : ''}`}
                href={`/courses/${termSlug}/${course.href}`}
              />
            ))}
          </div>
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
            href="/contact"
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

function CourseCard({
  title,
  code,
  description,
  href
}: {
  title: string;
  code: string;
  description: string;
  href: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-blue-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{code} - {description}</p>
        </div>
        <BookOpen size={16} className="text-blue-600 flex-shrink-0 ml-2" />
      </div>
      <Link
        href={href}
        className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center group"
      >
        View Details
        <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
    </div>
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-start">
        <Icon size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="font-medium mb-1">{title}</h3>
          <div className="text-sm text-gray-600">
            {content}
            <Link
              href={href}
              className="text-blue-600 hover:text-blue-700 inline-flex items-center group mt-2"
            >
              {linkText}
              <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}