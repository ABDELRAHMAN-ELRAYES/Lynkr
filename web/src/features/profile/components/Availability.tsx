import { useState, useEffect } from "react";
import { Plus, Clock, Calendar as CalendarIcon, Save, Copy, Trash2, Globe, AlertCircle } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { toast } from "sonner";
import { availabilityService } from "@/shared/services/availability.service";
import { SaveAvailabilityPayload, CreateAvailabilityPayload } from '@/shared/types/availability';

// Initial state for days of the week
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface TimeSlot {
  id: string; 
  start: string;
  end: string;
}

interface DaySchedule {
  day: string;
  dayIndex: number;
  isEnabled: boolean;
  slots: TimeSlot[];
}

export default function Availability() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const [schedule, setSchedule] = useState<DaySchedule[]>(
    WEEKDAYS.map((day, index) => ({
      day,
      dayIndex: index,
      isEnabled: false,
      slots: [],
    }))
  );

  // Load existing availability
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        setFetching(true);
        const availabilities = await availabilityService.getMyAvailabilities();
        console.log(availabilities)
        if (availabilities.length > 0) {
          // Reset schedule to empty first
          const newSchedule = WEEKDAYS.map((day, index) => ({
            day,
            dayIndex: index,
            isEnabled: false,
            slots: [] as TimeSlot[]
          }));

          // Populate with fetched data
          availabilities.forEach(avail => {
            const dayIndex = avail.dayOfWeek;
            if (dayIndex >= 0 && dayIndex <= 6) {
              const day = newSchedule[dayIndex];
              day.isEnabled = true;
              day.slots.push({
                id: avail.id || Math.random().toString(36).substr(2, 9),
                start: avail.startTime,
                end: avail.endTime
              });

              // Set timezone from first availability if available
              if (avail.timezone) {
                setTimezone(avail.timezone);
              }
            }
          });

          setSchedule(newSchedule);
        }
      } catch (error) {
        console.error("Failed to load availability:", error);
        toast.error("Failed to load your schedule");
      } finally {
        setFetching(false);
      }
    };

    loadAvailability();
  }, []);

  // Reorder to start with Monday for UI
  const orderedSchedule = [
    ...schedule.slice(1),
    schedule[0]
  ];

  const handleToggleDay = (dayName: string) => {
    setSchedule(prev => prev.map(d => {
      if (d.day !== dayName) return d;
      const isEnabled = !d.isEnabled;
      let slots = d.slots;
      if (isEnabled && slots.length === 0) {
        slots = [{ id: Math.random().toString(36).substr(2, 9), start: "09:00", end: "17:00" }];
      }
      return { ...d, isEnabled, slots };
    }));
  };

  const handleAddSlot = (dayName: string) => {
    setSchedule(prev => prev.map(d => {
      if (d.day !== dayName) return d;
      return {
        ...d,
        slots: [...d.slots, { id: Math.random().toString(36).substr(2, 9), start: "09:00", end: "17:00" }]
      };
    }));
  };

  const handleRemoveSlot = (dayName: string, slotId: string) => {
    setSchedule(prev => prev.map(d => {
      if (d.day !== dayName) return d;
      const newSlots = d.slots.filter(s => s.id !== slotId);
      return { ...d, slots: newSlots, isEnabled: newSlots.length > 0 ? d.isEnabled : false };
    }));
  };

  const handleTimeChange = (
    dayName: string,
    slotId: string,
    field: "start" | "end",
    value: string
  ) => {
    setSchedule(prev => prev.map(d => {
      if (d.day !== dayName) return d;
      return {
        ...d,
        slots: d.slots.map(s => s.id === slotId ? { ...s, [field]: value } : s)
      };
    }));
  };

  const copyToAll = (sourceDayName: string) => {
    const sourceDay = schedule.find(d => d.day === sourceDayName);
    if (!sourceDay || sourceDay.slots.length === 0) return;

    setSchedule(prev => prev.map(d => {
      if (d.day === sourceDayName) return d;
      return {
        ...d,
        isEnabled: true,
        slots: sourceDay.slots.map(s => ({ ...s, id: Math.random().toString(36).substr(2, 9) }))
      };
    }));
    toast.success(`Copied ${sourceDayName}'s schedule to all days`);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const availabilities: CreateAvailabilityPayload[] = [];

      schedule.forEach(day => {
        if (day.isEnabled && day.slots.length > 0) {
          day.slots.forEach(slot => {
            availabilities.push({
              dayOfWeek: day.dayIndex,
              startTime: slot.start,
              endTime: slot.end,
              timezone: timezone
            });
          });
        }
      });

      if (availabilities.length === 0) {
        toast.warning("Warning: You are saving an empty schedule. You will appear unavailable.");
      }

      const payload: SaveAvailabilityPayload = { availabilities };

      await availabilityService.saveAvailabilities(payload);

      toast.success("Availability updated successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to save availability. " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };

  // Get supported timezones safely
  const timezones = (Intl as any).supportedValuesOf ? (Intl as any).supportedValuesOf('timeZone') : [Intl.DateTimeFormat().resolvedOptions().timeZone];

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#7682e8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-[#7682e8]" />
              Weekly Availability
            </h1>
            <p className="text-gray-500 mt-1">
              Set your recurring weekly schedule. This will be used for all service bookings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="bg-transparent border-none text-sm text-gray-700 focus:ring-0 cursor-pointer min-w-[150px]"
              >
                {timezones.map((tz: string) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#7682e8] hover:bg-[#5a67d8] text-white px-6 min-w-[120px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h4 className="font-semibold text-blue-900 text-sm">How availability works</h4>
          <p className="text-sm text-blue-700 mt-1">
            Clients can book sessions within these hours. If a client proposes a custom time outside these hours, you'll have the option to approve or reject it.
          </p>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {orderedSchedule.map((day) => (
            <div
              key={day.day}
              className={`p-6 transition-colors ${day.isEnabled ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              <div className="flex items-center flex-col md:flex-row gap-4">
                {/* Day Toggle */}
                <div className="w-32 flex-shrink-0 pt-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={day.isEnabled}
                        onChange={() => handleToggleDay(day.day)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7682e8]"></div>
                    </div>
                    <span className={`ml-3 font-medium ${day.isEnabled ? 'text-gray-900' : 'text-gray-400'}`}>
                      {day.day}
                    </span>
                  </label>
                </div>

                {/* Slots Area */}
                <div className="flex-1 space-y-3 min-h-[44px]">
                  {!day.isEnabled ? (
                    <div className="text-sm text-gray-400 italic pt-2">Unavailable</div>
                  ) : (
                    <div className="space-y-3">
                      {day.slots.map((slot) => (
                        <div key={slot.id} className="flex justify-end items-center gap-3 animate-in slide-in-from-left-2 duration-200">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                              <input
                                type="time"
                                value={slot.start}
                                onChange={(e) => handleTimeChange(day.day, slot.id, "start", e.target.value)}
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7682e8] focus:border-[#7682e8] outline-none transition-all"
                              />
                            </div>
                            <span className="text-gray-400 font-medium">-</span>
                            <div className="relative">
                              <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                              <input
                                type="time"
                                value={slot.end}
                                onChange={(e) => handleTimeChange(day.day, slot.id, "end", e.target.value)}
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7682e8] focus:border-[#7682e8] outline-none transition-all"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveSlot(day.day, slot.id)}
                            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove slot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <div className="flex justify-end items-center gap-4 pt-1">
                        <button
                          onClick={() => handleAddSlot(day.day)}
                          className="flex items-center text-sm font-medium text-[#7682e8] hover:text-[#5a67d8] transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Period
                        </button>

                        {day.slots.length > 0 && (
                          <button
                            onClick={() => copyToAll(day.day)}
                            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                            title="Copy this schedule to all other days"
                          >
                            <Copy className="w-3.5 h-3.5 mr-1" />
                            Copy to all days
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
