// src/app/page.tsx
import { Clock, ChevronRight, MapPin, BookOpen, Archive } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Intro Section - Made more compact */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex items-center justify-between">
          <div className="pr-6">
            <h2 className="text-2xl font-bold mb-1">Mathematics & Statistics</h2>
            <p className="text-gray-600 text-sm">College of Lake County</p>
          </div>
          <img
            src="/headshotCK.jpg"
            alt="Cristina Sizemore"
            className="rounded-lg w-20 h-20 object-cover shadow-md hover:shadow-lg transition-shadow duration-200"
          />
        </div>

        {/* Current Courses Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock size={18} className="mr-2 text-blue-600" />
              Spring 2024 Courses
            </h3>
            <Link
              href="/courses/archive"
              className="text-sm text-gray-600 hover:text-blue-600 flex items-center group"
            >
              <Archive size={16} className="mr-1" />
              Past Courses
            </Link>
          </div>

          {/* Course Grid - Adjusted spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <CourseCard
              title="Statistics"
              code="MTH 142"
              description="Introduction to Statistics"
              href="/courses/mth142"
            />
            <CourseCard
              title="Resources"
              code="MATH"
              description="Study materials and guides"
              href="/resources"
            />
            <CourseCard
              title="Office Hours"
              code="Spring 2024"
              description="In-person and virtual availability"
              href="/office-hours"
            />
          </div>
        </div>

        {/* Quick Info Grid - Adjusted for better layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <QuickInfoCard
            icon={MapPin}
            title="Contact & Location"
            content={<>
              <p>Office: Room X123</p>
              <p>Email: email@clcillinois.edu</p>
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