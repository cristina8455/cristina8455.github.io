// src/app/test/office-hours/page.tsx
import { LocationInfo } from '@/components/office-hours/LocationInfo';
import { ScheduleDisplay } from '@/components/office-hours/ScheduleDisplay';
import { VirtualInfo } from '@/components/office-hours/VirtualInfo';
import { CompactOfficeHours } from '@/components/office-hours/CompactOfficeHours';
import { currentTermOfficeHours } from '@/data/office-hours';
import { Card, CardContent } from '@/components/ui/card';

export default function TestOfficeHoursPage() {
    return (
        <div className="container max-w-4xl py-8 space-y-8">
            {/* Original Version */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Original Office Hours Display</h2>
                <Card>
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold">Office Hours - Full Version</h3>
                    </div>
                    <CardContent className="grid gap-6">
                        <ScheduleDisplay schedule={currentTermOfficeHours.schedule} />
                        <div className="grid gap-6 md:grid-cols-2">
                            <LocationInfo location={currentTermOfficeHours.defaultLocation} />
                            <VirtualInfo virtualInfo={currentTermOfficeHours.virtualMeetingInfo} />
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Compact Version */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Compact Office Hours Display</h2>
                <Card>
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold">Office Hours - Compact Version</h3>
                    </div>
                    <CardContent>
                        <CompactOfficeHours />
                    </CardContent>
                </Card>
            </section>

            {/* Compact Version (Full Location) */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Compact Office Hours (with Full Location)</h2>
                <Card>
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold">Office Hours - Compact Version with Full Location</h3>
                    </div>
                    <CardContent>
                        <CompactOfficeHours showFullLocationDetails={true} />
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}