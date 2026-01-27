import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, PhoneOff, Video, X } from 'lucide-react';

interface IncomingCallModalProps {
    isOpen: boolean;
    meetingId: string;
    hostName: string;
    projectId?: string;
    onAccept: () => void;
    onDecline: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
    isOpen,
    meetingId,
    hostName,
    projectId,
    onAccept,
    onDecline,
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleAccept = async () => {
        onAccept();
        // Navigate to meeting room
        navigate(`/meeting/${meetingId}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onDecline}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[400px] overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Close button */}
                <button
                    onClick={onDecline}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="p-8 text-center">
                    {/* Animated video icon */}
                    <div className="relative mx-auto w-24 h-24 mb-6">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                        <div className="absolute inset-0 bg-green-500/30 rounded-full animate-pulse" />
                        <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                            <Video className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Caller info */}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        Incoming Video Call
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                        {hostName} is calling you
                    </p>
                    {projectId && (
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            Related to your project
                        </p>
                    )}

                    {/* Ringing indicator */}
                    <div className="flex items-center justify-center gap-1 my-6">
                        <span className="text-sm text-gray-400">Ringing</span>
                        <span className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={onDecline}
                            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-lg hover:shadow-red-500/25"
                            title="Decline"
                        >
                            <PhoneOff className="w-7 h-7 text-white" />
                        </button>

                        <button
                            onClick={handleAccept}
                            className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-lg hover:shadow-green-500/25"
                            title="Accept"
                        >
                            <Phone className="w-7 h-7 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallModal;
