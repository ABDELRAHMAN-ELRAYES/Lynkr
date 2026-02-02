import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { SlotCard } from '../components/SlotCard';
import { teachingService } from '@/shared/services/teaching.service';
import type { TeachingSlot } from '@/shared/types/teaching';
import Button from '@/shared/components/ui/Button';

interface ProviderInfo {
    id: string;
    title: string;
    hourlyRate: number;
    user: {
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
}

export const BookSessionPage: FC = () => {
    const { id: providerId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [slots, setSlots] = useState<TeachingSlot[]>([]);
    const [provider, setProvider] = useState<ProviderInfo | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<TeachingSlot | null>(null);
    const [bookingInProgress, setBookingInProgress] = useState(false);
    const [filterType, setFilterType] = useState<'all' | 'ONE_TO_ONE' | 'GROUP'>('all');

    useEffect(() => {
        if (providerId) {
            loadData();
        }
    }, [providerId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const slotsData = await teachingService.getProviderSlots(providerId!);
            setSlots(slotsData);

            // Extract provider info from the first slot if available
            if (slotsData.length > 0 && slotsData[0].providerProfile) {
                const provProfile = slotsData[0].providerProfile;
                setProvider({
                    id: provProfile.id,
                    title: provProfile.title || 'Tutor',
                    hourlyRate: provProfile.hourlyRate || 0,
                    user: {
                        firstName: provProfile.user.firstName,
                        lastName: provProfile.user.lastName,
                        avatarUrl: provProfile.user.avatarUrl,
                    },
                });
            }
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to load data';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleBookSlot = async (slot: TeachingSlot) => {
        setSelectedSlot(slot);
    };

    const handleConfirmBooking = async () => {
        if (!selectedSlot) return;

        try {
            setBookingInProgress(true);
            const result = await teachingService.bookSession(selectedSlot.id);

            // Redirect to Stripe checkout or handle payment
            // For now, show a toast with the payment info
            toast.success(`Booking initiated. Amount: $${(result.amount / 100).toFixed(2)}`);

            // In a real implementation, you would redirect to Stripe
            // window.location.href = result.checkoutUrl;

            // For demo, navigate to sessions
            navigate('/teaching/my-sessions');
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to book session';
            toast.error(errorMessage);
        } finally {
            setBookingInProgress(false);
            setSelectedSlot(null);
        }
    };

    const cancelBookingModal = () => {
        setSelectedSlot(null);
    };

    const filteredSlots = slots.filter((slot) => {
        if (filterType === 'all') return true;
        return slot.sessionType === filterType;
    });

    // Group slots by date
    const slotsByDate: Record<string, TeachingSlot[]> = {};
    filteredSlots.forEach((slot) => {
        const dateKey = slot.slotDate.split('T')[0];
        if (!slotsByDate[dateKey]) {
            slotsByDate[dateKey] = [];
        }
        slotsByDate[dateKey].push(slot);
    });

    // Sort dates
    const sortedDates = Object.keys(slotsByDate).sort();

    const formatDateHeader = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const calculatePrice = (durationMinutes: number): string => {
        if (!provider?.hourlyRate) return '0.00';
        return ((durationMinutes / 60) * provider.hourlyRate).toFixed(2);
    };

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
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                {/* Header */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-4">
                        {provider?.user.avatarUrl ? (
                            <img
                                src={provider.user.avatarUrl}
                                alt={`${provider.user.firstName} ${provider.user.lastName}`}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-[#7682e8]/20 flex items-center justify-center">
                                <span className="text-xl font-semibold text-[#7682e8]">
                                    {provider?.user.firstName?.[0]}{provider?.user.lastName?.[0]}
                                </span>
                            </div>
                        )}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Book a Session with {provider?.user.firstName} {provider?.user.lastName}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {provider?.title}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1 text-[#7682e8]">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="font-semibold">${provider?.hourlyRate}/hr</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-600 dark:text-gray-400">
                                    {slots.length} available slots
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-gray-600 dark:text-gray-400">Filter:</span>
                    <div className="flex gap-2">
                        {(['all', 'ONE_TO_ONE', 'GROUP'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === type
                                    ? 'bg-[#7682e8] text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {type === 'all' ? 'All' : type === 'ONE_TO_ONE' ? '1:1 Sessions' : 'Group Sessions'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Slots */}
                {sortedDates.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                            No available slots
                        </p>
                        <p className="text-gray-500 text-sm">
                            This tutor hasn't added any availability yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {sortedDates.map((dateKey) => (
                            <div key={dateKey}>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-[#7682e8]" />
                                    {formatDateHeader(dateKey)}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {slotsByDate[dateKey].map((slot) => (
                                        <SlotCard
                                            key={slot.id}
                                            slot={slot}
                                            viewType="student"
                                            hourlyRate={provider?.hourlyRate}
                                            onBook={handleBookSlot}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Booking Confirmation Modal */}
                {selectedSlot && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Confirm Booking
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {new Date(selectedSlot.slotDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        {selectedSlot.startTime} - {selectedSlot.endTime} ({selectedSlot.durationMinutes} min)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Users className="h-4 w-4" />
                                    <span>
                                        {selectedSlot.sessionType === 'ONE_TO_ONE' ? '1:1 Session' : 'Group Session'}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Total</span>
                                    <span className="text-2xl font-bold text-[#7682e8]">
                                        ${calculatePrice(selectedSlot.durationMinutes)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={cancelBookingModal}
                                    className="flex-1"
                                    disabled={bookingInProgress}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleConfirmBooking}
                                    className="flex-1 bg-[#7682e8] hover:bg-[#5a67d8] text-white"
                                    disabled={bookingInProgress}
                                >
                                    {bookingInProgress ? 'Processing...' : 'Confirm & Pay'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
