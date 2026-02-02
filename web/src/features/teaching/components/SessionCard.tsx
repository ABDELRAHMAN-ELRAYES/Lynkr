import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Users, Play, Square, Video, X } from 'lucide-react';
import { SessionStatusTag, SessionTypeTag } from '@/shared/components/common/tags';
import type { TeachingSession } from '@/shared/types/availability';
import Button from '@/shared/components/ui/Button';

interface SessionCardProps {
    session: TeachingSession;
    viewType: 'instructor' | 'student';
    onStart?: (sessionId: string) => void;
    onComplete?: (sessionId: string) => void;
    onCancel?: (sessionId: string) => void;
    onJoin?: (sessionId: string) => void;
}

export const SessionCard: FC<SessionCardProps> = ({
    session,
    viewType,
    onStart,
    onComplete,
    onCancel,
    onJoin,
}) => {
    const navigate = useNavigate();

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
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

    const instructorName = session.slot.providerProfile.user.firstName + ' ' +
        session.slot.providerProfile.user.lastName;

    const handleViewDetails = () => {
        navigate(`/teaching/sessions/${session.id}`);
    };

    const canStart = viewType === 'instructor' && session.status === 'SCHEDULED';
    const canComplete = viewType === 'instructor' && session.status === 'IN_PROGRESS';
    const canJoin = session.status === 'IN_PROGRESS';
    const canCancel = session.status === 'SCHEDULED';

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <SessionTypeTag type={session.slot.sessionType} size="sm" />
                        <SessionStatusTag status={session.status} size="sm" />
                    </div>
                    {viewType === 'student' && (
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            with {instructorName}
                        </p>
                    )}
                    {viewType === 'instructor' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {session.participants.length} participant(s)
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(session.slot.slotDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{session.slot.startTime} - {session.slot.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{session.slot.durationMinutes} min</span>
                </div>
                {session.slot.sessionType === 'GROUP' && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{session.participants.length} / {session.slot.maxParticipants}</span>
                    </div>
                )}
            </div>

            {session.startedAt && (
                <p className="text-xs text-gray-500 mb-4">
                    Started: {formatTime(session.startedAt)}
                </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                {canStart && (
                    <Button
                        onClick={() => onStart?.(session.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                    >
                        <Play className="h-4 w-4 mr-1" />
                        Start Session
                    </Button>
                )}

                {canComplete && viewType === 'instructor' && (
                    <Button
                        onClick={() => onComplete?.(session.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                    >
                        <Square className="h-4 w-4 mr-1" />
                        End Session
                    </Button>
                )}

                {canJoin && (
                    <Button
                        onClick={() => onJoin?.(session.id)}
                        className="bg-[#7682e8] hover:bg-[#5a67d8] text-white"
                        size="sm"
                    >
                        <Video className="h-4 w-4 mr-1" />
                        Join Session
                    </Button>
                )}

                {canCancel && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCancel?.(session.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewDetails}
                    className="ml-auto"
                >
                    View Details
                </Button>
            </div>
        </div>
    );
};
