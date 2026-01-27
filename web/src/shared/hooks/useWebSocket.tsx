import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Message, ProjectActivity } from '@/shared/types/project';
import type {
    TypingIndicator,
    SocketNotification,
    MessageReadEvent,
    MeetingInvite,
    MeetingStarted,
} from '@/shared/types/socket';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

export function useWebSocket(token: string | null) {
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [notifications, setNotifications] = useState<SocketNotification[]>([]);
    const [typingUsers, setTypingUsers] = useState<Map<string, boolean>>(new Map());
    const [incomingCall, setIncomingCall] = useState<MeetingInvite | null>(null);
    const [activeMeeting, setActiveMeeting] = useState<MeetingStarted | null>(null);
    const [projectActivities, setProjectActivities] = useState<ProjectActivity[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const activeConversationRef = useRef<string | null>(null);
    const activeProjectRef = useRef<string | null>(null);

    useEffect(() => {
        if (!token) return;

        // Create Socket.IO connection with JWT auth
        const socket = io(WS_URL, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('[Socket.IO] Connected');
            setConnected(true);
        });

        socket.on('disconnect', (reason) => {
            console.log('[Socket.IO] Disconnected:', reason);
            setConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('[Socket.IO] Connection error:', error);
            setConnected(false);
        });

        // Listen for new messages
        socket.on('message:new', (data: { conversationId: string; message: Message }) => {
            setMessages((prev) => [...prev, data.message]);
        });

        // Listen for message read events
        socket.on('message:read', (data: MessageReadEvent) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    data.messageIds?.includes(msg.id) ? { ...msg, readAt: data.readAt } : msg
                )
            );
        });

        // Listen for conversation read events
        socket.on('conversation:read', (data: MessageReadEvent) => {
            // Could update UI to show all messages read
            console.log('[Socket.IO] Conversation read:', data);
        });

        // Listen for typing indicators
        socket.on('conversation:typing', (data: TypingIndicator) => {
            setTypingUsers((prev) => {
                const newMap = new Map(prev);
                if (data.isTyping) {
                    newMap.set(data.userId, true);
                } else {
                    newMap.delete(data.userId);
                }
                return newMap;
            });
        });

        // Listen for notifications
        socket.on('notification', (notification: SocketNotification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        // Listen for project activity updates
        socket.on('project:activity', (activity: ProjectActivity) => {
            console.log('[Socket.IO] Project activity:', activity);
            setProjectActivities((prev) => [activity, ...prev]);
        });

        // ============================================
        // Meeting Events
        // ============================================

        // Incoming call invitation
        socket.on('meeting:invite', (data: MeetingInvite) => {
            console.log('[Socket.IO] Incoming call:', data);
            setIncomingCall(data);
        });

        // Meeting started (after accepting)
        socket.on('meeting:started', (data: MeetingStarted) => {
            console.log('[Socket.IO] Meeting started:', data);
            setActiveMeeting(data);
            setIncomingCall(null);
        });

        // Meeting ended
        socket.on('meeting:ended', (_data: { meetingId: string }) => {
            console.log('[Socket.IO] Meeting ended');
            setActiveMeeting(null);
            setIncomingCall(null);
        });

        // Call declined by other party
        socket.on('meeting:declined', (_data: { meetingId: string }) => {
            console.log('[Socket.IO] Call declined');
            setIncomingCall(null);
        });

        // Meeting cancelled by host
        socket.on('meeting:cancelled', (_data: { meetingId: string }) => {
            console.log('[Socket.IO] Meeting cancelled');
            setActiveMeeting(null);
            setIncomingCall(null);
        });

        // Call accepted by other party (for host)
        socket.on('meeting:accepted', (data: { meetingId: string }) => {
            console.log('[Socket.IO] Call accepted:', data);
            // Host will receive started event with token separately
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [token]);

    // Join a conversation room
    const joinConversation = useCallback((conversationId: string) => {
        const socket = socketRef.current;
        if (!socket || !socket.connected) {
            console.warn('[Socket.IO] Cannot join conversation: not connected');
            return;
        }

        // Leave previous conversation if any
        if (activeConversationRef.current) {
            socket.emit('conversation:leave', activeConversationRef.current);
        }

        socket.emit('conversation:join', conversationId);
        activeConversationRef.current = conversationId;
        console.log('[Socket.IO] Joined conversation:', conversationId);
    }, []);

    // Leave current conversation room
    const leaveConversation = useCallback(() => {
        const socket = socketRef.current;
        if (!socket || !activeConversationRef.current) return;

        socket.emit('conversation:leave', activeConversationRef.current);
        activeConversationRef.current = null;
    }, []);

    // Join a project room
    const joinProject = useCallback((projectId: string) => {
        const socket = socketRef.current;
        if (!socket || !socket.connected) {
            console.warn('[Socket.IO] Cannot join project: not connected');
            return;
        }

        // Leave previous project if any
        if (activeProjectRef.current) {
            socket.emit('project:leave', activeProjectRef.current);
        }

        socket.emit('project:join', projectId);
        activeProjectRef.current = projectId;
        console.log('[Socket.IO] Joined project:', projectId);
    }, []);

    // Leave current project room
    const leaveProject = useCallback(() => {
        const socket = socketRef.current;
        if (!socket || !activeProjectRef.current) return;

        socket.emit('project:leave', activeProjectRef.current);
        activeProjectRef.current = null;
    }, []);

    // Send typing indicator
    const sendTypingIndicator = useCallback((conversationId: string, isTyping: boolean) => {
        const socket = socketRef.current;
        if (!socket || !socket.connected) return;

        socket.emit('conversation:typing', { conversationId, isTyping });
    }, []);

    // Mark messages as read
    const markConversationAsRead = useCallback((conversationId: string) => {
        const socket = socketRef.current;
        if (!socket || !socket.connected) return;

        socket.emit('conversation:markRead', { conversationId });
    }, []);

    // Clear local messages state
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    // Add a message to local state (for optimistic updates)
    const addLocalMessage = useCallback((message: Message) => {
        setMessages((prev) => [...prev, message]);
    }, []);

    // Mark notification as read locally
    const markNotificationAsRead = useCallback((notificationId: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
    }, []);

    // Clear all notifications
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    // Get typing user IDs
    const getTypingUsers = useCallback(() => {
        return Array.from(typingUsers.keys());
    }, [typingUsers]);

    // ============================================
    // Meeting Actions
    // ============================================

    // Accept incoming call
    const acceptCall = useCallback((meetingId: string) => {
        const socket = socketRef.current;
        if (!socket || !socket.connected) return;

        socket.emit('meeting:accept', { meetingId });
    }, []);

    // Decline incoming call
    const declineCall = useCallback((meetingId: string) => {
        const socket = socketRef.current;
        if (!socket || !socket.connected) return;

        socket.emit('meeting:decline', { meetingId });
        setIncomingCall(null);
    }, []);

    // Clear incoming call (e.g., when navigating away)
    const clearIncomingCall = useCallback(() => {
        setIncomingCall(null);
    }, []);

    // Clear active meeting
    const clearActiveMeeting = useCallback(() => {
        setActiveMeeting(null);
    }, []);

    // Clear project activities
    const clearProjectActivities = useCallback(() => {
        setProjectActivities([]);
    }, []);

    return {
        connected,
        messages,
        notifications,
        typingUsers: getTypingUsers(),
        incomingCall,
        activeMeeting,
        projectActivities,
        joinConversation,
        leaveConversation,
        joinProject,
        leaveProject,
        sendTypingIndicator,
        markConversationAsRead,
        clearMessages,
        addLocalMessage,
        markNotificationAsRead,
        clearNotifications,
        acceptCall,
        declineCall,
        clearIncomingCall,
        clearActiveMeeting,
        clearProjectActivities,
    };
}
