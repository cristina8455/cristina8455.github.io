// src/types/office-hours.ts
export type OfficeHoursTimeSlot = {
    start: string;
    end: string;
    type: 'in-person' | 'virtual';
    location?: string;  // Room number for in-person, link for virtual
    notes?: string;     // Optional additional information
};

export type DaySchedule = {
    day: string;
    times: OfficeHoursTimeSlot[];
};

export type TermOfficeHours = {
    term: string;
    schedule: DaySchedule[];
    defaultLocation: {
        room: string;
        building: string;
        floor: string;
    };
    virtualMeetingInfo?: {
        platform: 'Zoom' | 'Teams';
        link?: string;
        meetingId?: string;
        password?: string;
    };
    additionalNotes?: string[];
};

// For future calendar integration
export type CalendarIntegration = {
    provider: 'Office365' | 'Google';
    calendarId: string;
    credentials?: {
        clientId: string;
        tenantId?: string;  // For Office365
    };
};

// For future topic tracking
export type TopicTag = {
    id: string;
    name: string;
    course?: string;  // Optional course association
    color?: string;   // For visual distinction
};