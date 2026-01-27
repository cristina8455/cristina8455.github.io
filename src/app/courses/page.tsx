// src/app/courses/page.tsx
import Link from 'next/link';
import { ChevronRight, BookOpen, Clock, Archive } from 'lucide-react';
import { getAllCourses, getAllTerms, type Course } from '@/lib/courses';

// ISR: revalidate every 24 hours
export const revalidate = 86400;

export default async function CoursesPage() {
  const [courses, terms] = await Promise.all([
    getAllCourses(),
    getAllTerms(),
  ]);

  const now = new Date();

  // Group courses by term
  const coursesByTerm = new Map<string, Course[]>();
  for (const course of courses) {
    if (!course.term) continue;
    const termSlug = course.term.slug;
    if (!coursesByTerm.has(termSlug)) {
      coursesByTerm.set(termSlug, []);
    }
    coursesByTerm.get(termSlug)!.push(course);
  }

  // Separate current and past terms
  const currentTerms = terms.filter(t => !t.endAt || t.endAt > now);
  const pastTerms = terms.filter(t => t.endAt && t.endAt <= now);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <BookOpen size={24} className="mr-3 text-primary" />
            All Courses
          </h1>
          <p className="text-muted-foreground mt-2">
            Current and past courses from Canvas
          </p>
        </div>

        {/* Current Term Courses */}
        {currentTerms.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold flex items-center mb-4 text-card-foreground">
              <Clock size={18} className="mr-2 text-primary" />
              Current Courses
            </h2>
            {currentTerms.map(term => (
              <TermSection
                key={term.slug}
                termName={term.name}
                courses={coursesByTerm.get(term.slug) || []}
              />
            ))}
          </section>
        )}

        {/* Past Term Courses */}
        {pastTerms.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold flex items-center mb-4 text-card-foreground">
              <Archive size={18} className="mr-2 text-muted-foreground" />
              Past Courses
            </h2>
            {pastTerms.map(term => (
              <TermSection
                key={term.slug}
                termName={term.name}
                courses={coursesByTerm.get(term.slug) || []}
                collapsed
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function TermSection({
  termName,
  courses,
  collapsed = false,
}: {
  termName: string;
  courses: Course[];
  collapsed?: boolean;
}) {
  if (courses.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
        {termName}
      </h3>
      <div className={`grid gap-4 ${collapsed ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} compact={collapsed} />
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course, compact = false }: { course: Course; compact?: boolean }) {
  const href = `/courses/${course.term?.slug}/${course.slug}`;

  if (compact) {
    return (
      <Link
        href={href}
        className="group flex items-center justify-between bg-card rounded-lg border border-border p-4
                   transition-all duration-200
                   hover:shadow-md hover:border-primary/15
                   dark:hover:shadow-lg dark:hover:shadow-primary/5"
      >
        <div>
          <h4 className="font-medium text-card-foreground">{course.name}</h4>
          <p className="text-sm text-muted-foreground">{course.code}</p>
        </div>
        <ChevronRight
          size={18}
          className="text-primary/60 group-hover:text-primary group-hover:translate-x-1
                     transition-all duration-200"
        />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group block bg-card rounded-lg border border-border p-6
                 transition-all duration-200
                 hover:shadow-md hover:border-primary/15
                 dark:hover:shadow-lg dark:hover:shadow-primary/5"
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">{course.name}</h2>
              <p className="text-primary font-medium">{course.code}</p>
            </div>
            <BookOpen size={20} className="text-primary flex-shrink-0 ml-4 opacity-90" />
          </div>
        </div>
        <ChevronRight
          size={20}
          className="text-primary/80 ml-4 transform transition-all duration-200
                   group-hover:translate-x-1 group-hover:text-primary"
        />
      </div>
    </Link>
  );
}
