/**
 * Socket.IO related types for real-time communication
 */

export interface TypingIndicator {
    userId: string;
    isTyping: boolean;
}

export interface SocketNotification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    data?: any;
    read?: boolean;
}

export interface MessageReadEvent {
    conversationId: string;
    userId: string;
    messageIds?: string[];
    readAt: Date;
}

export interface MeetingInvite {
    meetingId: string;
    projectId: string;
    hostId: string;
    hostName: string;
    channelName: string;
}

export interface MeetingStarted {
    meetingId: string;
    channelName: string;
    token: string;
    appId: string;
}
