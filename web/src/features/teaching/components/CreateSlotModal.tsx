import { FC, useState } from 'react';
import { X, Clock, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { teachingService } from '@/shared/services/availability.service';
import type { CreateSlotPayload, SessionType, TeachingSlot } from '@/shared/types/availability';

interface CreateSlotModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editSlot?: TeachingSlot | null;
}

export const CreateSlotModal: FC<CreateSlotModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    editSlot,
}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateSlotPayload>({
        slotDate: editSlot?.slotDate?.split('T')[0] || '',
        startTime: editSlot?.startTime || '',
        endTime: editSlot?.endTime || '',
        durationMinutes: editSlot?.durationMinutes || 60,
        sessionType: editSlot?.sessionType || 'ONE_TO_ONE',
        maxParticipants: editSlot?.maxParticipants || 1,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const isEditing = Boolean(editSlot);

    const handleInputChange = (field: keyof CreateSlotPayload, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSessionTypeChange = (type: SessionType) => {
        setFormData((prev) => ({
            ...prev,
            sessionType: type,
            maxParticipants: type === 'ONE_TO_ONE' ? 1 : (prev.maxParticipants ?? 1) > 1 ? prev.maxParticipants : 5,
        }));
    };

    const calculateDuration = (start: string, end: string): number => {
        if (!start || !end) return 0;
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        return (endH * 60 + endM) - (startH * 60 + startM);
    };

    const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
        const newFormData = { ...formData, [field]: value };
        if (newFormData.startTime && newFormData.endTime) {
            const duration = calculateDuration(newFormData.startTime, newFormData.endTime);
            if (duration > 0) {
                newFormData.durationMinutes = duration;
            }
        }
        setFormData(newFormData);
    };

    const validateForm = (): boolean => {
        if (!formData.slotDate) {
            toast.error('Please select a date');
            return false;
        }
        if (!formData.startTime || !formData.endTime) {
            toast.error('Please specify start and end times');
            return false;
        }
        if (formData.durationMinutes <= 0) {
            toast.error('End time must be after start time');
            return false;
        }

        // Validate date is not in the past
        const selectedDate = new Date(formData.slotDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            toast.error('Cannot create slots for past dates');
            return false;
        }

        // Validate max 4 weeks ahead
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 28);
        if (selectedDate > maxDate) {
            toast.error('Cannot schedule more than 4 weeks ahead');
            return false;
        }

        if (formData.sessionType === 'GROUP' && formData.maxParticipants! < 2) {
            toast.error('Group sessions must have at least 2 participants');
            return false;
        }

        if (formData.maxParticipants! > 20) {
            toast.error('Maximum 20 participants allowed');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            if (isEditing && editSlot) {
                await teachingService.updateSlot(editSlot.id, {
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    durationMinutes: formData.durationMinutes,
                    sessionType: formData.sessionType,
                    maxParticipants: formData.maxParticipants,
                });
                toast.success('Slot updated successfully');
            } else {
                await teachingService.createSlot(formData);
                toast.success('Slot created successfully');
            }
            onSuccess();
            onClose();
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                `Failed to ${isEditing ? 'update' : 'create'} slot`;
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Calculate min date (today) and max date (4 weeks ahead)
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 28);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {isEditing ? 'Edit Slot' : 'Create New Slot'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Date */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Date
                        </Label>
                        <Input
                            type="date"
                            value={formData.slotDate}
                            onChange={(e) => handleInputChange('slotDate', e.target.value)}
                            min={today}
                            max={maxDateStr}
                            disabled={isEditing}
                            className="w-full"
                        />
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Start Time
                            </Label>
                            <Input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {formData.durationMinutes > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Duration: {formData.durationMinutes} minutes
                        </p>
                    )}

                    {/* Session Type */}
                    <div className="space-y-2">
                        <Label>Session Type</Label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleSessionTypeChange('ONE_TO_ONE')}
                                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${formData.sessionType === 'ONE_TO_ONE'
                                    ? 'border-[#7682e8] bg-[#7682e8]/10 text-[#7682e8]'
                                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                1:1 Session
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSessionTypeChange('GROUP')}
                                className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${formData.sessionType === 'GROUP'
                                    ? 'border-[#7682e8] bg-[#7682e8]/10 text-[#7682e8]'
                                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                Group Session
                            </button>
                        </div>
                    </div>

                    {/* Max Participants (for Group) */}
                    {formData.sessionType === 'GROUP' && (
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Max Participants (2-20)
                            </Label>
                            <Input
                                type="number"
                                min={2}
                                max={20}
                                value={formData.maxParticipants}
                                onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 2)}
                                className="w-full"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="flex-1 bg-[#7682e8] hover:bg-[#5a67d8] text-white"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : isEditing ? 'Update Slot' : 'Create Slot'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
