// src/components/office-hours/ScheduleDisplay.tsx
import { MapPin, Video } from 'lucide-react';
import type { DaySchedule } from '@/types/office-hours';

export function ScheduleDisplay({ schedule }: { schedule: DaySchedule[] }) {
    return (
        <div className="space-y-4">
            {schedule.map((day) => (
                <div key={day.day} className="border-l-4 border-blue-600 pl-4">
                    <h4 className="font-medium">{day.day}</h4>
                    {day.times.map((time, index) => (
                        <div key={index} className="mt-1 flex items-center text-gray-600">
                            <span>{time.start} - {time.end}</span>
                            {time.type === 'virtual' ? (
                                <Video size={16} className="ml-2 text-blue-600" />
                            ) : (
                                <MapPin size={16} className="ml-2 text-blue-600" />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}