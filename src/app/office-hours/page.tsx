// src/app/office-hours/page.tsx
import { Clock, AlertCircle, MapPin, Video, ExternalLink } from 'lucide-react';
import { getOfficeHours } from '@/lib/canvas-api';
import { getCurrentCourses } from '@/lib/courses';

// ISR: revalidate every 24 hours
export const revalidate = 86400;

export default async function OfficeHoursPage() {
  // Get current courses (filtered: Fall 2024+, excludes Math Dept Resources)
  const courses = await getCurrentCourses();

  // Try multiple courses to find the most complete office hours data
  // (some courses may have the Zoom link, others may not)
  let officeHours = null;
  for (const course of courses.slice(0, 3)) {
    const hours = await getOfficeHours(course.id);
    if (hours && hours.schedule.length > 0) {
      // Prefer data with a Zoom link
      if (!officeHours || (hours.zoomLink && !officeHours.zoomLink)) {
        officeHours = hours;
      }
      // If we found complete data, stop looking
      if (officeHours.zoomLink) break;
    }
  }

  // Fallback if parsing fails
  if (!officeHours || officeHours.schedule.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Clock size={24} className="mr-2 text-primary" />
              Office Hours
            </h2>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 dark:text-amber-200 font-medium">
                    Office hours are available on Canvas
                  </p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                    Please check your course homepage in Canvas for current office hours and Zoom links.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Group schedule by type for display
  const hasVirtual = officeHours.schedule.some(d => d.times.some(t => t.type === 'virtual'));
  const hasInPerson = officeHours.schedule.some(d => d.times.some(t => t.type === 'in-person'));

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Clock size={24} className="mr-2 text-primary" />
            Office Hours
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Schedule Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Weekly Schedule</h3>
              <div className="space-y-3">
                {officeHours.schedule.map((daySchedule) => (
                  <div
                    key={daySchedule.day}
                    className="flex items-start p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="font-medium w-28 flex-shrink-0">
                      {daySchedule.day}
                    </div>
                    <div className="flex-grow space-y-1">
                      {daySchedule.times.map((slot, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-2 ${
                              slot.type === 'virtual'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                            }`}
                          >
                            {slot.type === 'virtual' ? (
                              <Video size={12} className="mr-1" />
                            ) : (
                              <MapPin size={12} className="mr-1" />
                            )}
                            {slot.type === 'virtual' ? 'Zoom' : 'In Person'}
                          </span>
                          <span className="text-muted-foreground">
                            {slot.start} - {slot.end}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              {/* Location */}
              {hasInPerson && officeHours.room && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <MapPin size={18} className="mr-2 text-green-600 dark:text-green-400" />
                    In-Person Location
                  </h4>
                  <p className="text-muted-foreground">
                    Room {officeHours.room}
                  </p>
                </div>
              )}

              {/* Virtual */}
              {hasVirtual && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Video size={18} className="mr-2 text-blue-600 dark:text-blue-400" />
                    Virtual Office Hours
                  </h4>
                  {officeHours.zoomLink ? (
                    <a
                      href={officeHours.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      Join Zoom Meeting
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Zoom link available in Canvas
                    </p>
                  )}
                </div>
              )}

              {/* Additional Notes */}
              <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle size={20} className="text-primary mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Additional Availability</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {officeHours.additionalNotes.length > 0 ? (
                        officeHours.additionalNotes.map((note, idx) => (
                          <p key={idx}>{note}</p>
                        ))
                      ) : (
                        <p>Additional appointments available by email request.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
