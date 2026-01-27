import { FC, useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { SlotCard } from '../components/SlotCard';
import { CreateSlotModal } from '../components/CreateSlotModal';
import { teachingService } from '@/shared/services/teaching.service';
import type { TeachingSlot } from '@/shared/types/teaching';
import Button from '@/shared/components/ui/Button';

interface WeekData {
    startDate: Date;
    endDate: Date;
    slots: TeachingSlot[];
}

export const AvailabilityPage: FC = () => {
    const [loading, setLoading] = useState(true);
    const [slots, setSlots] = useState<TeachingSlot[]>([]);
    const [selectedWeek, setSelectedWeek] = useState(0); // 0-3 for weeks 1-4
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editSlot, setEditSlot] = useState<TeachingSlot | null>(null);

    useEffect(() => {
        loadSlots();
    }, []);

    const loadSlots = async () => {
        try {
            setLoading(true);
            const data = await teachingService.getMySlots();
            setSlots(data);
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to load slots';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getWeekDates = (weekOffset: number): { start: Date; end: Date } => {
        const today = new Date();
        const startOfWeek = new Date(today);
        // Move to Monday of this week
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1) + (weekOffset * 7);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return { start: startOfWeek, end: endOfWeek };
    };

    const getWeekData = (weekOffset: number): WeekData => {
        const { start, end } = getWeekDates(weekOffset);

        const weekSlots = slots.filter((slot) => {
            const slotDate = new Date(slot.slotDate);
            return slotDate >= start && slotDate <= end;
        });

        // Sort by date and time
        weekSlots.sort((a, b) => {
            const dateCompare = new Date(a.slotDate).getTime() - new Date(b.slotDate).getTime();
            if (dateCompare !== 0) return dateCompare;
            return a.startTime.localeCompare(b.startTime);
        });

        return {
            startDate: start,
            endDate: end,
            slots: weekSlots,
        };
    };

    const formatWeekRange = (start: Date, end: Date): string => {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    };

    const handleDeleteSlot = async (slotId: string) => {
        if (!window.confirm('Are you sure you want to delete this slot?')) {
            return;
        }

        try {
            await teachingService.deleteSlot(slotId);
            toast.success('Slot deleted successfully');
            loadSlots();
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to delete slot';
            toast.error(errorMessage);
        }
    };

    const handleEditSlot = (slot: TeachingSlot) => {
        setEditSlot(slot);
        setShowCreateModal(true);
    };

    const handleModalClose = () => {
        setShowCreateModal(false);
        setEditSlot(null);
    };

    const handleSlotCreated = () => {
        loadSlots();
        handleModalClose();
    };

    const currentWeekData = getWeekData(selectedWeek);

    // Group slots by day
    const slotsByDay: Record<string, TeachingSlot[]> = {};
    currentWeekData.slots.forEach((slot) => {
        const dateKey = slot.slotDate.split('T')[0];
        if (!slotsByDay[dateKey]) {
            slotsByDay[dateKey] = [];
        }
        slotsByDay[dateKey].push(slot);
    });

    // Generate all days of the week
    const weekDays: Date[] = [];
    const currentDate = new Date(currentWeekData.startDate);
    while (currentDate <= currentWeekData.endDate) {
        weekDays.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Availability
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage your teaching schedule and availability slots
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-[#7682e8] hover:bg-[#5a67d8] text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Slot
                    </Button>
                </div>

                {/* Week Navigation */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
                            disabled={selectedWeek === 0}
                            className={`p-2 rounded-lg transition-colors ${selectedWeek === 0
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-[#7682e8]" />
                            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Week {selectedWeek + 1}: {formatWeekRange(currentWeekData.startDate, currentWeekData.endDate)}
                            </span>
                        </div>

                        <button
                            onClick={() => setSelectedWeek(Math.min(3, selectedWeek + 1))}
                            disabled={selectedWeek === 3}
                            className={`p-2 rounded-lg transition-colors ${selectedWeek === 3
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Week tabs */}
                    <div className="flex justify-center gap-2 mt-4">
                        {[0, 1, 2, 3].map((week) => (
                            <button
                                key={week}
                                onClick={() => setSelectedWeek(week)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedWeek === week
                                        ? 'bg-[#7682e8] text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Week {week + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {weekDays.map((day) => {
                        const dateKey = day.toISOString().split('T')[0];
                        const daySlots = slotsByDay[dateKey] || [];
                        const isToday = day.toDateString() === new Date().toDateString();
                        const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

                        return (
                            <div
                                key={dateKey}
                                className={`bg-white dark:bg-gray-800 border rounded-lg p-4 ${isToday
                                        ? 'border-[#7682e8] ring-2 ring-[#7682e8]/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                    } ${isPast ? 'opacity-50' : ''}`}
                            >
                                <div className="text-center mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 uppercase">
                                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </p>
                                    <p className={`text-lg font-semibold ${isToday ? 'text-[#7682e8]' : 'text-gray-900 dark:text-gray-100'
                                        }`}>
                                        {day.getDate()}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {daySlots.length === 0 ? (
                                        <p className="text-xs text-gray-400 text-center py-4">
                                            No slots
                                        </p>
                                    ) : (
                                        daySlots.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className={`text-xs p-2 rounded ${slot.session
                                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                                                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                                    }`}
                                            >
                                                <p className="font-medium">
                                                    {slot.startTime} - {slot.endTime}
                                                </p>
                                                <p className="text-xs opacity-75">
                                                    {slot.sessionType === 'ONE_TO_ONE' ? '1:1' : 'Group'}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Detailed Slot List */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Slots for {formatWeekRange(currentWeekData.startDate, currentWeekData.endDate)}
                    </h2>

                    {currentWeekData.slots.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                                No slots for this week
                            </p>
                            <p className="text-gray-500 text-sm mb-4">
                                Create availability slots for students to book
                            </p>
                            <Button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-[#7682e8] hover:bg-[#5a67d8] text-white"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Your First Slot
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentWeekData.slots.map((slot) => (
                                <SlotCard
                                    key={slot.id}
                                    slot={slot}
                                    viewType="instructor"
                                    onEdit={handleEditSlot}
                                    onDelete={handleDeleteSlot}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Create/Edit Modal */}
                <CreateSlotModal
                    isOpen={showCreateModal}
                    onClose={handleModalClose}
                    onSuccess={handleSlotCreated}
                    editSlot={editSlot}
                />
            </div>
        </div>
    );
};
