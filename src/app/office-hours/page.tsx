// src/app/office-hours/page.tsx
import { Clock, AlertCircle } from 'lucide-react';
import { currentTermOfficeHours } from '@/data/office-hours';
import { ScheduleDisplay } from '@/components/office-hours/ScheduleDisplay';
import { LocationInfo } from '@/components/office-hours/LocationInfo';
import { VirtualInfo } from '@/components/office-hours/VirtualInfo';

export default function OfficeHours() {
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
                            <ScheduleDisplay schedule={currentTermOfficeHours.schedule} />
                        </div>

                        {/* Info Section */}
                        <div className="space-y-6">
                            <LocationInfo location={currentTermOfficeHours.defaultLocation} />
                            <VirtualInfo virtualInfo={currentTermOfficeHours.virtualMeetingInfo} />

                            <div className="bg-primary/10 dark:bg-primary/5 rounded-lg p-4">
                                <div className="flex items-start">
                                    <AlertCircle size={20} className="text-primary mt-1 mr-2 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium mb-1 text-primary-foreground/90">Additional Availability</h4>
                                        <div className="text-sm text-muted-foreground space-y-2">
                                            {currentTermOfficeHours.additionalNotes?.map((note, index) => (
                                                <p key={index}>{note}</p>
                                            ))}
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