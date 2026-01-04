import { useEffect, useState, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

interface Message {
    id: string;
    operationId: string;
    senderId: string;
    content: string;
    messageType: string;
    timestamp: string;
}

interface TypingIndicator {
    operationId: string;
    userId: string;
    isTyping: boolean;
}

interface Notification {
    type: string;
    title: string;
    message: string;
    link?: string;
    data?: any;
}

export function useWebSocket(userId: string | null) {
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!userId) return;

        // Create STOMP client
        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            debug: (str) => {
                console.log('[WebSocket]', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('WebSocket connected');
            setConnected(true);

            // Subscribe to user notifications
            client.subscribe(`/topic/user/${userId}/notifications`, (message) => {
                const notification = JSON.parse(message.body) as Notification;
                setNotifications((prev) => [notification, ...prev]);
            });
        };

        client.onDisconnect = () => {
            console.log('WebSocket disconnected');
            setConnected(false);
        };

        client.onStompError = (frame) => {
            console.error('WebSocket error:', frame);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [userId]);

    const subscribeToOperation = useCallback((operationId: string) => {
        const client = clientRef.current;
        if (!client || !client.connected) {
            console.warn('WebSocket not connected');
            return null;
        }

        // Subscribe to operation messages
        const messageSub = client.subscribe(`/topic/operation/${operationId}`, (message) => {
            const msg = JSON.parse(message.body) as Message;
            setMessages((prev) => [...prev, msg]);
        });

        // Subscribe to typing indicators
        const typingSub = client.subscribe(`/topic/operation/${operationId}/typing`, (message) => {
            const typing = JSON.parse(message.body) as TypingIndicator;
            // Handle typing indicator (emit event or update state)
            console.log('Typing indicator:', typing);
        });

        // Return unsubscribe function
        return () => {
            messageSub.unsubscribe();
            typingSub.unsubscribe();
        };
    }, []);

    const sendMessage = useCallback((operationId: string, content: string, messageType: string = 'TEXT') => {
        const client = clientRef.current;
        if (!client || !client.connected || !userId) {
            console.warn('Cannot send message: WebSocket not connected');
            return;
        }

        client.publish({
            destination: '/app/chat/send',
            body: JSON.stringify({
                operationId,
                senderId: userId,
                content,
                messageType,
            }),
        });
    }, [userId]);

    const sendTypingIndicator = useCallback((operationId: string, isTyping: boolean) => {
        const client = clientRef.current;
        if (!client || !client.connected || !userId) return;

        client.publish({
            destination: '/app/chat/typing',
            body: JSON.stringify({
                operationId,
                userId,
                isTyping,
            }),
        });
    }, [userId]);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    const markNotificationAsRead = useCallback((notificationId: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
    }, []);

    return {
        connected,
        messages,
        notifications,
        subscribeToOperation,
        sendMessage,
        sendTypingIndicator,
        clearMessages,
        markNotificationAsRead,
    };
}
