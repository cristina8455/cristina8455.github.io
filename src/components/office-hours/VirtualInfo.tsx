// src/components/office-hours/VirtualInfo.tsx
import { Video, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import type { TermOfficeHours } from '@/types/office-hours';

export function VirtualInfo({ virtualInfo }: {
    virtualInfo: TermOfficeHours['virtualMeetingInfo']
}) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Video size={20} className="mr-2 text-primary" />
                Virtual Office Hours
            </h3>
            <p className="text-muted-foreground mb-2">
                Join via {virtualInfo?.platform} during scheduled virtual office hours.
            </p>
            {virtualInfo?.link && (
                <Link
                    href={virtualInfo.link}
                    className="inline-flex items-center text-primary hover:text-primary/80 
                             transition-colors duration-200"
                >
                    Join Meeting
                    <CalendarCheck size={16} className="ml-2" />
                </Link>
            )}
        </div>
    );
}