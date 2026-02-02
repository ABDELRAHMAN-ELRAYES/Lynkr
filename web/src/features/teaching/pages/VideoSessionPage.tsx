import { FC, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AgoraRTC, {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    PhoneOff,
    Users,
    Monitor,
    MonitorOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { teachingService } from '@/shared/services/availability.service';
import { useAgora } from '@/shared/hooks/useAgora';
import type { SessionVideoInfo } from '@/shared/types/availability';
import Button from '@/shared/components/ui/Button';

export const VideoSessionPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { appId } = useAgora();

    // Get video info from navigation state or fetch it
    const initialVideoInfo = (location.state as { videoInfo?: SessionVideoInfo })?.videoInfo;

    // Agora state
    const [client] = useState<IAgoraRTCClient>(() =>
        AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    );
    const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
    const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
    const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
    const [isJoined, setIsJoined] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [videoInfo, setVideoInfo] = useState<SessionVideoInfo | null>(initialVideoInfo || null);

    const localVideoRef = useRef<HTMLDivElement>(null);
    const screenTrackRef = useRef<ICameraVideoTrack | null>(null);

    useEffect(() => {
        if (!initialVideoInfo && id) {
            fetchVideoInfo();
        } else if (initialVideoInfo) {
            setLoading(false);
        }
    }, [id, initialVideoInfo]);

    useEffect(() => {
        if (videoInfo && appId && !isJoined) {
            joinChannel();
        }

        return () => {
            leaveChannel();
        };
    }, [videoInfo, appId]);

    const fetchVideoInfo = async () => {
        try {
            setLoading(true);
            const result = await teachingService.joinSession(id!);
            setVideoInfo(result.videoInfo);
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to join session';
            toast.error(errorMessage);
            navigate('/teaching/my-sessions');
        } finally {
            setLoading(false);
        }
    };

    const joinChannel = async () => {
        if (!videoInfo || !appId) return;

        try {
            // Set up event handlers
            client.on('user-published', async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                if (mediaType === 'video') {
                    setRemoteUsers((prev) => {
                        if (prev.find((u) => u.uid === user.uid)) {
                            return prev;
                        }
                        return [...prev, user];
                    });
                }
                if (mediaType === 'audio') {
                    user.audioTrack?.play();
                }
            });

            client.on('user-unpublished', (user, mediaType) => {
                if (mediaType === 'video') {
                    setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
                }
            });

            client.on('user-left', (user) => {
                setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
            });

            // Join the channel
            await client.join(
                appId,
                videoInfo.channelName,
                videoInfo.token,
                videoInfo.uid
            );

            // Create and publish local tracks
            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
            setLocalAudioTrack(audioTrack);
            setLocalVideoTrack(videoTrack);

            await client.publish([audioTrack, videoTrack]);

            // Play local video
            if (localVideoRef.current) {
                videoTrack.play(localVideoRef.current);
            }

            setIsJoined(true);
        } catch (error) {
            console.error('Error joining channel:', error);
            toast.error('Failed to join video session');
        }
    };

    const leaveChannel = async () => {
        // Close local tracks
        localAudioTrack?.close();
        localVideoTrack?.close();
        screenTrackRef.current?.close();

        // Leave channel
        if (client.connectionState === 'CONNECTED') {
            await client.leave();
        }

        setRemoteUsers([]);
        setIsJoined(false);
    };

    const handleLeaveSession = async () => {
        if (!id) return;

        try {
            await teachingService.leaveSession(id);
            await leaveChannel();
            toast.success('Left session');
            navigate('/teaching/my-sessions');
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to leave session';
            toast.error(errorMessage);
        }
    };

    const toggleVideo = async () => {
        if (localVideoTrack) {
            await localVideoTrack.setEnabled(!isVideoEnabled);
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    const toggleAudio = async () => {
        if (localAudioTrack) {
            await localAudioTrack.setEnabled(!isAudioEnabled);
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            // Stop screen sharing
            if (screenTrackRef.current) {
                await client.unpublish(screenTrackRef.current);
                screenTrackRef.current.close();
                screenTrackRef.current = null;
            }

            // Re-publish camera
            if (localVideoTrack) {
                await client.publish(localVideoTrack);
                if (localVideoRef.current) {
                    localVideoTrack.play(localVideoRef.current);
                }
            }
            setIsScreenSharing(false);
        } else {
            try {
                // Create screen share track
                const screenTrack = await AgoraRTC.createScreenVideoTrack({}, 'disable');
                screenTrackRef.current = screenTrack as ICameraVideoTrack;

                // Unpublish camera and publish screen
                if (localVideoTrack) {
                    await client.unpublish(localVideoTrack);
                }
                await client.publish(screenTrackRef.current);

                // Play screen share in local view
                if (localVideoRef.current) {
                    screenTrackRef.current.play(localVideoRef.current);
                }

                setIsScreenSharing(true);
            } catch (error) {
                console.error('Error sharing screen:', error);
                toast.error('Failed to share screen');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8] mx-auto mb-4" />
                    <p className="text-gray-400">Joining session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-900 flex flex-col">
            {/* Video Grid */}
            <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
                {/* Local Video */}
                <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
                    <div
                        ref={localVideoRef}
                        className="w-full h-full"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                        You {isScreenSharing && '(Screen)'}
                    </div>
                    {!isVideoEnabled && !isScreenSharing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                            <VideoOff className="h-12 w-12 text-gray-500" />
                        </div>
                    )}
                </div>

                {/* Remote Users */}
                {remoteUsers.map((user) => (
                    <div
                        key={user.uid}
                        className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video"
                    >
                        <RemoteUser user={user} />
                        <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                            User {user.uid}
                        </div>
                    </div>
                ))}

                {/* Empty slots */}
                {remoteUsers.length === 0 && (
                    <div className="bg-gray-800 rounded-lg flex items-center justify-center aspect-video">
                        <div className="text-center text-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-2" />
                            <p>Waiting for others...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="bg-gray-800 p-4 flex items-center justify-center gap-4">
                <button
                    onClick={toggleAudio}
                    className={`p-4 rounded-full transition-colors ${isAudioEnabled
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                >
                    {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </button>

                <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full transition-colors ${isVideoEnabled
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                >
                    {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </button>

                <button
                    onClick={toggleScreenShare}
                    className={`p-4 rounded-full transition-colors ${isScreenSharing
                        ? 'bg-[#7682e8] hover:bg-[#5a67d8] text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                >
                    {isScreenSharing ? <MonitorOff className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
                </button>

                <Button
                    onClick={handleLeaveSession}
                    className="bg-red-600 hover:bg-red-700 text-white px-6"
                >
                    <PhoneOff className="h-5 w-5 mr-2" />
                    Leave
                </Button>
            </div>
        </div>
    );
};

// Remote user video component
const RemoteUser: FC<{ user: IAgoraRTCRemoteUser }> = ({ user }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && user.videoTrack) {
            user.videoTrack.play(containerRef.current);
        }
    }, [user.videoTrack]);

    return <div ref={containerRef} className="w-full h-full" />;
};
