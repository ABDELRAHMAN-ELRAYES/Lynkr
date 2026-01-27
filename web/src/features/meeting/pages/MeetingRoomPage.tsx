import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AgoraRTC, {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import { meetingService } from '@/shared/services/meeting.service';
import Button from '@/shared/components/ui/Button';
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    Monitor,
    Maximize,
    Minimize,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

const MeetingRoomPage: React.FC = () => {
    const { id: meetingId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // Agora state
    const [client] = useState<IAgoraRTCClient>(() =>
        AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    );
    const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
    const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
    const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

    // UI state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [meetingInfo, setMeetingInfo] = useState<{
        channelName: string;
        token: string;
        appId: string;
        projectTitle?: string;
    } | null>(null);

    const localVideoRef = useRef<HTMLDivElement>(null);
    const remoteVideoRef = useRef<HTMLDivElement>(null);
    const screenTrackRef = useRef<any>(null);

    // Get token data from navigation state or fetch it
    useEffect(() => {
        const initMeeting = async () => {
            if (!meetingId) {
                setError('No meeting ID provided');
                setLoading(false);
                return;
            }

            try {
                // Check if token was passed via navigation state
                const stateData = location.state as any;
                if (stateData?.token && stateData?.channelName && stateData?.appId) {
                    setMeetingInfo({
                        token: stateData.token,
                        channelName: stateData.channelName,
                        appId: stateData.appId,
                        projectTitle: stateData.projectTitle,
                    });
                } else {
                    // Fetch token from API
                    const tokenData = await meetingService.getJoinToken(meetingId);
                    setMeetingInfo({
                        token: tokenData.token,
                        channelName: tokenData.channelName,
                        appId: tokenData.appId,
                    });
                }
            } catch (err) {
                console.error('Failed to get meeting token:', err);
                setError('Failed to join meeting. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        initMeeting();
    }, [meetingId, location.state]);

    // Join the Agora channel
    useEffect(() => {
        if (!meetingInfo || !client) return;

        const joinChannel = async () => {
            try {
                // Set up event handlers
                client.on('user-published', async (user, mediaType) => {
                    await client.subscribe(user, mediaType);
                    console.log('Subscribed to remote user:', user.uid);

                    if (mediaType === 'video') {
                        setRemoteUsers((prev) => {
                            if (prev.find((u) => u.uid === user.uid)) return prev;
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
                    meetingInfo.appId,
                    meetingInfo.channelName,
                    meetingInfo.token,
                    null // Let Agora assign a UID
                );

                // Create and publish local tracks
                const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                setLocalAudioTrack(audioTrack);
                setLocalVideoTrack(videoTrack);

                await client.publish([audioTrack, videoTrack]);

                // Start the meeting on the server
                if (meetingId) {
                    await meetingService.startMeeting(meetingId);
                }

                console.log('Joined channel successfully');
            } catch (err) {
                console.error('Failed to join channel:', err);
                setError('Failed to join video call. Please check your camera/microphone permissions.');
            }
        };

        joinChannel();

        return () => {
            leaveChannel();
        };
    }, [meetingInfo, client, meetingId]);

    // Play local video when track is available
    useEffect(() => {
        if (localVideoTrack && localVideoRef.current) {
            localVideoTrack.play(localVideoRef.current);
        }
    }, [localVideoTrack]);

    // Play remote video when users join
    useEffect(() => {
        remoteUsers.forEach((user) => {
            if (user.videoTrack && remoteVideoRef.current) {
                user.videoTrack.play(remoteVideoRef.current);
            }
        });
    }, [remoteUsers]);

    const leaveChannel = async () => {
        localAudioTrack?.close();
        localVideoTrack?.close();
        screenTrackRef.current?.close();
        await client.leave();
        setLocalAudioTrack(null);
        setLocalVideoTrack(null);
        setRemoteUsers([]);
    };

    const handleLeaveCall = async () => {
        try {
            if (meetingId) {
                await meetingService.endMeeting(meetingId);
            }
            await leaveChannel();
            navigate(-1);
        } catch (err) {
            console.error('Error leaving call:', err);
            navigate(-1);
        }
    };

    const toggleAudio = async () => {
        if (localAudioTrack) {
            await localAudioTrack.setEnabled(!isAudioEnabled);
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    const toggleVideo = async () => {
        if (localVideoTrack) {
            await localVideoTrack.setEnabled(!isVideoEnabled);
            setIsVideoEnabled(!isVideoEnabled);
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
            // Republish camera
            if (localVideoTrack) {
                await client.publish(localVideoTrack);
            }
            setIsScreenSharing(false);
        } else {
            // Start screen sharing
            try {
                const screenTrack = await AgoraRTC.createScreenVideoTrack({}, 'disable');
                if (localVideoTrack) {
                    await client.unpublish(localVideoTrack);
                }
                await client.publish(screenTrack as any);
                screenTrackRef.current = screenTrack;
                setIsScreenSharing(true);
                toast.success('Screen sharing started');
            } catch (err) {
                console.error('Screen sharing failed:', err);
                toast.error('Failed to share screen');
            }
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-white text-lg">Joining meeting...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-white text-lg mb-4">{error}</p>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Header */}
            <header className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-white font-semibold">
                        {meetingInfo?.projectTitle || 'Video Meeting'}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {remoteUsers.length + 1} participant{remoteUsers.length !== 0 && 's'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                        Live
                    </span>
                </div>
            </header>

            {/* Video Grid */}
            <main className="flex-1 p-4 flex gap-4">
                {/* Remote Video (Large) */}
                <div className="flex-1 relative bg-gray-800 rounded-xl overflow-hidden">
                    {remoteUsers.length > 0 ? (
                        <div
                            ref={remoteVideoRef}
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Video className="w-12 h-12 text-gray-500" />
                                </div>
                                <p className="text-gray-400">Waiting for others to join...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Local Video (Small) */}
                <div className="w-64 bg-gray-800 rounded-xl overflow-hidden relative">
                    <div
                        ref={localVideoRef}
                        className="w-full h-full min-h-[180px]"
                    />
                    {!isVideoEnabled && (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                                <VideoOff className="w-8 h-8 text-gray-500" />
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                        <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                            You {!isAudioEnabled && '(muted)'}
                        </span>
                    </div>
                </div>
            </main>

            {/* Controls */}
            <footer className="bg-gray-800 px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                    <Button
                        variant={isAudioEnabled ? 'outline' : 'destructive'}
                        size="lg"
                        onClick={toggleAudio}
                        className="w-14 h-14 rounded-full p-0"
                    >
                        {isAudioEnabled ? (
                            <Mic className="w-6 h-6" />
                        ) : (
                            <MicOff className="w-6 h-6" />
                        )}
                    </Button>

                    <Button
                        variant={isVideoEnabled ? 'outline' : 'destructive'}
                        size="lg"
                        onClick={toggleVideo}
                        className="w-14 h-14 rounded-full p-0"
                    >
                        {isVideoEnabled ? (
                            <Video className="w-6 h-6" />
                        ) : (
                            <VideoOff className="w-6 h-6" />
                        )}
                    </Button>

                    <Button
                        variant={isScreenSharing ? 'default' : 'outline'}
                        size="lg"
                        onClick={toggleScreenShare}
                        className="w-14 h-14 rounded-full p-0"
                    >
                        <Monitor className="w-6 h-6" />
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={toggleFullscreen}
                        className="w-14 h-14 rounded-full p-0"
                    >
                        {isFullscreen ? (
                            <Minimize className="w-6 h-6" />
                        ) : (
                            <Maximize className="w-6 h-6" />
                        )}
                    </Button>

                    <Button
                        variant="destructive"
                        size="lg"
                        onClick={handleLeaveCall}
                        className="w-14 h-14 rounded-full p-0 ml-4"
                    >
                        <PhoneOff className="w-6 h-6" />
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default MeetingRoomPage;
