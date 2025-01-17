// src/components/office-hours/CompactOfficeHours.tsx
import React from 'react';
import { MapPin, Video, Clock } from 'lucide-react';
import { currentTermOfficeHours } from '@/data/office-hours';
import type { OfficeHoursTimeSlot } from '@/types/office-hours';

interface CompactOfficeHoursProps {
    showFullLocationDetails?: boolean;
}

export function CompactOfficeHours({ showFullLocationDetails = false }: CompactOfficeHoursProps) {
    const { schedule, defaultLocation, virtualMeetingInfo, additionalNotes = [] } = currentTermOfficeHours;

    // Helper to render time slot with appropriate icon
    const renderTimeSlot = (time: OfficeHoursTimeSlot, index: number) => (
        <div key={index} className="flex items-center text-muted-foreground text-sm">
            <span>{time.start} - {time.end}</span>
            {time.type === 'virtual' ? (
                <Video size={14} className="ml-2 text-primary opacity-90" />
            ) : (
                <MapPin size={14} className="ml-2 text-primary opacity-90" />
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Weekly Schedule Section */}
            <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock size={20} className="text-primary" />
                    Weekly Student Hours
                </h3>
                <div className="grid gap-3">
                    {schedule.map((day) => (
                        <div
                            key={day.day}
                            className="border-l-2 border-primary/70 pl-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-card-foreground">{day.day}</span>
                                <div className="flex items-center gap-4">
                                    {day.times.map(renderTimeSlot)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Location and Virtual Info */}
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                {/* In-Person Location */}
                <div>
                    <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                        <MapPin size={16} className="text-primary" />
                        In-Person Location
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        {showFullLocationDetails ? (
                            <>
                                Room {defaultLocation.room}<br />
                                College of Lake County<br />
                                Building {defaultLocation.building}, {defaultLocation.floor}
                            </>
                        ) : (
                            <>Room {defaultLocation.room}, Building {defaultLocation.building}</>
                        )}
                    </p>
                </div>

                {/* Virtual Meeting Info */}
                {virtualMeetingInfo && (
                    <div>
                        <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                            <Video size={16} className="text-primary" />
                            Virtual Hours
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Join via {virtualMeetingInfo.platform} during scheduled virtual hours
                        </p>
                    </div>
                )}
            </div>

            {/* Additional Notes */}
            {additionalNotes.length > 0 && (
                <div className="bg-primary/5 text-card-foreground rounded-lg p-4 text-sm">
                    <ul className="space-y-1">
                        {additionalNotes.map((note, index) => (
                            <li key={index}>{note}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}