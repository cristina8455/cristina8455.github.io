// src/components/office-hours/LocationInfo.tsx
import { MapPin } from 'lucide-react';
import type { TermOfficeHours } from '@/types/office-hours';

export function LocationInfo({ location }: { location: TermOfficeHours['defaultLocation'] }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
                <MapPin size={20} className="mr-2 text-blue-600" />
                In-Person Location
            </h3>
            <p className="text-gray-600">
                Room {location.room}<br />
                College of Lake County<br />
                Building {location.building}, {location.floor}
            </p>
        </div>
    );
}