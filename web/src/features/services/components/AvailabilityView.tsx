import { FC, useEffect, useState } from "react";
import { Clock, Calendar as CalendarIcon, Globe, AlertCircle } from "lucide-react";
import { availabilityService } from "@/shared/services/availability.service";
import { toast } from "sonner";
import { ProviderAvailability } from "@/shared/types/availability";

interface AvailabilityViewProps {
    providerId: string;
}

const WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export const AvailabilityView: FC<AvailabilityViewProps> = ({ providerId }) => {
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState<{ day: string; dayIndex: number; slots: ProviderAvailability[] }[]>([]);
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

    useEffect(() => {
        const loadAvailability = async () => {
            try {
                setLoading(true);
                const availabilities = await availabilityService.getProviderAvailabilities(providerId);

                // Group by day
                const grouped = WEEKDAYS.map((day, index) => {
                    return {
                        day,
                        dayIndex: index,
                        slots: availabilities.filter(a => a.dayOfWeek === index).sort((a, b) => a.startTime.localeCompare(b.startTime))
                    };
                });

                setSchedule(grouped);

                // Set timezone if available from first slot
                if (availabilities.length > 0 && availabilities[0].timezone) {
                    // Optional: You could set this to the provider's timezone to show "Provider Time"
                    // For now, let's keep it user's local or default to provider's if we want to be explicit
                }

            } catch (error) {
                console.error("Failed to load availability:", error);
                toast.error("Failed to load provider availability");
            } finally {
                setLoading(false);
            }
        };

        if (providerId) {
            loadAvailability();
        }
    }, [providerId]);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-[#7682e8] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Check if there's any availability at all
    const hasAvailability = schedule.some(d => d.slots.length > 0);

    if (!hasAvailability) {
        return (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No Availability Listed</h3>
                <p className="text-gray-500 mt-1">This provider hasn't set their recurring weekly availability yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-[#7682e8]" />
                            Weekly Schedule
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Provider's recurring weekly availability.</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Globe className="w-4 h-4" />
                        <span>{timezone}</span>
                    </div>
                </div>

                <div className="grid gap-4">
                    {schedule.map((day) => (
                        <div
                            key={day.day}
                            className={`flex flex-col sm:flex-row sm:items-center py-4 px-4 rounded-lg border ${day.slots.length > 0 ? 'bg-white border-gray-200' : 'bg-gray-50 border-transparent opacity-60'
                                }`}
                        >
                            <div className="w-32 font-medium text-gray-900 mb-2 sm:mb-0 flex-shrink-0">
                                {day.day}
                            </div>

                            <div className="flex-1">
                                {day.slots.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {day.slots.map(slot => (
                                            <div key={slot.id} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md text-sm font-medium border border-indigo-100">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{slot.startTime} - {slot.endTime}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-400 italic">Unavailable</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-blue-900 text-sm">Want to request a meeting?</h4>
                    <p className="text-sm text-blue-700 mt-1">
                        You can request a meeting during these times by starting a project or clicking "Request Service". You can also propose a custom time if needed.
                    </p>
                </div>
            </div>
        </div>
    );
};
