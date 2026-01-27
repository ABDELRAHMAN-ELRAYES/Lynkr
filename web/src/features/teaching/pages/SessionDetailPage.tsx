import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Users, Video, X, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { SessionStatusTag, SessionTypeTag } from '@/shared/components/common/tags';
import { teachingService } from '@/shared/services/teaching.service';
import type { TeachingSession } from '@/shared/types/teaching';
import { useAuth } from '@/shared/hooks/use-auth';
import Button from '@/shared/components/ui/Button';

export const SessionDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<TeachingSession | null>(null);

    const isInstructor = user?.id === session?.instructorId;

    useEffect(() => {
        if (id) {
            loadSession();
        }
    }, [id]);

    const loadSession = async () => {
        try {
            setLoading(true);
            const data = await teachingService.getSessionById(id!);
            setSession(data);
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to load session';
            toast.error(errorMessage);
            navigate('/teaching/my-sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleStartSession = async () => {
        if (!session) return;

        try {
            const result = await teachingService.startSession(session.id);
            toast.success('Session started');
            navigate(`/teaching/video/${session.id}`, {
                state: { videoInfo: result.videoInfo }
            });
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to start session';
            toast.error(errorMessage);
        }
    };

    const handleJoinSession = async () => {
        if (!session) return;

        try {
            const result = await teachingService.joinSession(session.id);
            navigate(`/teaching/video/${session.id}`, {
                state: { videoInfo: result.videoInfo }
            });
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to join session';
            toast.error(errorMessage);
        }
    };

    const handleCancelSession = async () => {
        if (!session) return;

        const message = isInstructor
            ? 'Are you sure you want to cancel this session? All participants will be refunded.'
            : 'Are you sure you want to cancel your booking? You will receive a full refund.';

        if (!window.confirm(message)) {
            return;
        }

        try {
            await teachingService.cancelSession(session.id);
            toast.success('Session cancelled');
            loadSession();
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to cancel session';
            toast.error(errorMessage);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400">Session not found</p>
            </div>
        );
    }

    const instructorName = `${session.slot.providerProfile.user.firstName} ${session.slot.providerProfile.user.lastName}`;
    const canStart = isInstructor && session.status === 'SCHEDULED';
    const canJoin = session.status === 'IN_PROGRESS';
    const canCancel = session.status === 'SCHEDULED';
    const showChat = session.slot.sessionType === 'ONE_TO_ONE' && session.status !== 'CANCELLED';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                {/* Main Content */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <SessionTypeTag type={session.slot.sessionType} />
                                <SessionStatusTag status={session.status} />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {session.slot.sessionType === 'ONE_TO_ONE' ? '1:1 Session' : 'Group Session'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {isInstructor ? `You are the instructor` : `with ${instructorName}`}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Session Details
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <Calendar className="h-5 w-5 text-[#7682e8]" />
                                    <span>{formatDate(session.slot.slotDate)}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <Clock className="h-5 w-5 text-[#7682e8]" />
                                    <span>
                                        {session.slot.startTime} - {session.slot.endTime} ({session.slot.durationMinutes} min)
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                    <Users className="h-5 w-5 text-[#7682e8]" />
                                    <span>
                                        {session.participants.length} / {session.slot.maxParticipants} participants
                                    </span>
                                </div>
                            </div>

                            {session.startedAt && (
                                <p className="text-sm text-gray-500">
                                    Started at: {formatTime(session.startedAt)}
                                </p>
                            )}
                            {session.completedAt && (
                                <p className="text-sm text-gray-500">
                                    Completed at: {formatTime(session.completedAt)}
                                </p>
                            )}
                        </div>

                        {/* Participants */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Participants
                            </h2>

                            {session.participants.length === 0 ? (
                                <p className="text-gray-500 text-sm">No participants yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {session.participants.map((participant) => (
                                        <div
                                            key={participant.id}
                                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[#7682e8]/20 flex items-center justify-center">
                                                <span className="text-sm font-medium text-[#7682e8]">
                                                    {participant.user?.firstName?.[0] || 'U'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {participant.user?.firstName} {participant.user?.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {participant.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
                        {canStart && (
                            <Button
                                onClick={handleStartSession}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                <Video className="h-4 w-4 mr-2" />
                                Start Session
                            </Button>
                        )}

                        {canJoin && (
                            <Button
                                onClick={handleJoinSession}
                                className="bg-[#7682e8] hover:bg-[#5a67d8] text-white"
                            >
                                <Video className="h-4 w-4 mr-2" />
                                Join Session
                            </Button>
                        )}

                        {showChat && (
                            <Button
                                variant="outline"
                                onClick={() => toast.info('Chat feature coming soon')}
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Open Chat
                            </Button>
                        )}

                        {canCancel && (
                            <Button
                                variant="outline"
                                onClick={handleCancelSession}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel Session
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
