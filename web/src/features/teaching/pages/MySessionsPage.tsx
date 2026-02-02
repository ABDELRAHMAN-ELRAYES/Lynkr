import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { SessionCard } from '../components/SessionCard';
import { teachingService } from '@/shared/services/teaching.service';
import type { TeachingSession, SessionStatus } from '@/shared/types/teaching';

export const MySessionsPage: FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<TeachingSession[]>([]);
    const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('all');

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            setLoading(true);
            const data = await teachingService.getMySessions();
            setSessions(data);
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to load sessions';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSession = async (sessionId: string) => {
        if (!window.confirm('Are you sure you want to cancel this session? You will receive a full refund.')) {
            return;
        }

        try {
            await teachingService.cancelSession(sessionId);
            toast.success('Session cancelled. Refund will be processed.');
            loadSessions();
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to cancel session';
            toast.error(errorMessage);
        }
    };

    const handleJoinSession = async (sessionId: string) => {
        try {
            const result = await teachingService.joinSession(sessionId);
            navigate(`/teaching/video/${sessionId}`, {
                state: { videoInfo: result.videoInfo }
            });
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to join session';
            toast.error(errorMessage);
        }
    };

    const filteredSessions = sessions.filter((session) => {
        if (statusFilter === 'all') return true;
        return session.status === statusFilter;
    }).sort((a, b) => {
        // Sort by status priority (IN_PROGRESS first, then SCHEDULED, then others)
        const statusPriority: Record<SessionStatus, number> = {
            IN_PROGRESS: 0,
            SCHEDULED: 1,
            COMPLETED: 2,
            CANCELLED: 3,
            NO_SHOW: 4,
        };
        const statusDiff = statusPriority[a.status] - statusPriority[b.status];
        if (statusDiff !== 0) return statusDiff;

        // Then by date
        return new Date(a.slot.slotDate).getTime() - new Date(b.slot.slotDate).getTime();
    });

    const upcomingSessions = filteredSessions.filter(s =>
        s.status === 'SCHEDULED' || s.status === 'IN_PROGRESS'
    );
    const pastSessions = filteredSessions.filter(s =>
        s.status === 'COMPLETED' || s.status === 'CANCELLED' || s.status === 'NO_SHOW'
    );

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
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        My Booked Sessions
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        View and manage your learning sessions
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as SessionStatus | 'all')}
                            className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7682e8]"
                        >
                            <option value="all">All Status</option>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                {filteredSessions.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                            No sessions found
                        </p>
                        <p className="text-gray-500 text-sm">
                            Book a session with a tutor to get started
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Upcoming Sessions */}
                        {upcomingSessions.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Upcoming Sessions ({upcomingSessions.length})
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {upcomingSessions.map((session) => (
                                        <SessionCard
                                            key={session.id}
                                            session={session}
                                            viewType="student"
                                            onCancel={handleCancelSession}
                                            onJoin={handleJoinSession}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Past Sessions */}
                        {pastSessions.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Past Sessions ({pastSessions.length})
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {pastSessions.map((session) => (
                                        <SessionCard
                                            key={session.id}
                                            session={session}
                                            viewType="student"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
