import { FC } from 'react';
import { Clock, Users, Calendar, Trash2, Edit2 } from 'lucide-react';
import { SessionStatusTag, SessionTypeTag } from '@/shared/components/common/tags';
import type { TeachingSlot } from '@/shared/types/availability';
import Button from '@/shared/components/ui/Button';

interface SlotCardProps {
    slot: TeachingSlot;
    viewType: 'instructor' | 'student';
    onEdit?: (slot: TeachingSlot) => void;
    onDelete?: (slotId: string) => void;
    onBook?: (slot: TeachingSlot) => void;
    hourlyRate?: number;
}

export const SlotCard: FC<SlotCardProps> = ({
    slot,
    viewType,
    onEdit,
    onDelete,
    onBook,
    hourlyRate,
}) => {
    const isBooked = slot.session && slot.session.status !== 'CANCELLED';
    const participantCount = slot.session?.participantCount || 0;
    const isFull = participantCount >= slot.maxParticipants;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const calculatePrice = (durationMinutes: number, rate: number) => {
        return ((durationMinutes / 60) * rate).toFixed(2);
    };

    return (
        <div className={`
            bg-white dark:bg-gray-800 border rounded-lg p-4
            ${isBooked ? 'border-blue-300 dark:border-blue-700' : 'border-gray-200 dark:border-gray-700'}
            ${isFull ? 'opacity-60' : ''}
            transition-all hover:shadow-md
        `}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(slot.slotDate)}
                    </span>
                </div>
                <SessionTypeTag type={slot.sessionType} size="sm" />
            </div>

            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span>{slot.durationMinutes} min</span>
                </div>
            </div>

            {slot.sessionType === 'GROUP' && (
                <div className="flex items-center gap-1 mb-3 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{participantCount} / {slot.maxParticipants} participants</span>
                </div>
            )}

            {slot.session && (
                <div className="mb-3">
                    <SessionStatusTag status={slot.session.status} size="sm" />
                </div>
            )}

            {viewType === 'student' && hourlyRate && !isFull && (
                <div className="mb-3">
                    <span className="text-lg font-semibold text-[#7682e8]">
                        ${calculatePrice(slot.durationMinutes, hourlyRate)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                        (${hourlyRate}/hr)
                    </span>
                </div>
            )}

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                {viewType === 'instructor' && !isBooked && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit?.(slot)}
                            className="flex-1"
                        >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete?.(slot.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </>
                )}
                {viewType === 'instructor' && isBooked && (
                    <span className="text-sm text-gray-500">Session booked</span>
                )}
                {viewType === 'student' && !isFull && (
                    <Button
                        onClick={() => onBook?.(slot)}
                        className="flex-1 bg-[#7682e8] hover:bg-[#5a67d8] text-white"
                    >
                        Book Session
                    </Button>
                )}
                {viewType === 'student' && isFull && (
                    <span className="text-sm text-gray-500">Session Full</span>
                )}
            </div>
        </div>
    );
};
