import { useEffect, useState, useRef } from 'react';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import Button from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/input';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Send, Paperclip } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface Message {
    id: string;
    operationId: string;
    senderId: string;
    content: string;
    messageType: string;
    timestamp: string;
}

interface ChatInterfaceProps {
    operationId: string;
    currentUserId: string;
    participants?: { id: string; name: string }[];
}

export function ChatInterface({ operationId, currentUserId, participants = [] }: ChatInterfaceProps) {
    const { connected, messages: realtimeMessages, sendMessage, subscribeToOperation, sendTypingIndicator } = useWebSocket(currentUserId);

    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load message history on mount
    useEffect(() => {
        loadMessageHistory();
    }, [operationId]);

    // Subscribe to operation when connected
    useEffect(() => {
        if (connected && operationId) {
            const unsubscribe = subscribeToOperation(operationId);
            return () => unsubscribe?.();
        }
    }, [connected, operationId]);

    // Combine historical and realtime messages
    useEffect(() => {
        if (realtimeMessages.length > 0) {
            const latestMessage = realtimeMessages[realtimeMessages.length - 1];
            // Avoid duplicates
            if (!allMessages.some(m => m.id === latestMessage.id)) {
                setAllMessages(prev => [...prev, latestMessage as Message]);
            }
        }
    }, [realtimeMessages]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [allMessages]);

    const loadMessageHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/messages/operation/${operationId}/recent?limit=100`);
            if (response.data.success) {
                setAllMessages(response.data.data || []);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = () => {
        if (!inputValue.trim() || !connected) return;

        sendMessage(operationId, inputValue.trim(), 'TEXT');
        setInputValue('');

        // Stop typing indicator
        sendTypingIndicator(operationId, false);
        setIsTyping(false);
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);

        // Send typing indicator
        if (!isTyping && value.trim()) {
            sendTypingIndicator(operationId, true);
            setIsTyping(true);
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingIndicator(operationId, false);
            setIsTyping(false);
        }, 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const getInitials = (userId: string) => {
        const participant = participants.find(p => p.id === userId);
        if (participant) {
            return participant.name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
        return userId.substring(0, 2).toUpperCase();
    };

    const getUserName = (userId: string) => {
        const participant = participants.find(p => p.id === userId);
        return participant?.name || 'User';
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const groupMessagesByDate = (messages: Message[]) => {
        const groups: { [key: string]: Message[] } = {};

        messages.forEach(message => {
            const dateKey = formatDate(message.timestamp);
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(message);
        });

        return groups;
    };

    const messageGroups = groupMessagesByDate(allMessages);

    if (loading) {
        return (
            <Card className="h-[600px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </Card>
        );
    }

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <CardTitle>Chat</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm text-muted-foreground">
                            {connected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                    {Object.keys(messageGroups).length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <p>No messages yet</p>
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    ) : (
                        Object.entries(messageGroups).map(([date, messages]) => (
                            <div key={date} className="mb-6">
                                {/* Date Divider */}
                                <div className="flex items-center gap-4 my-4">
                                    <div className="flex-1 border-t"></div>
                                    <span className="text-xs text-muted-foreground px-2">{date}</span>
                                    <div className="flex-1 border-t"></div>
                                </div>

                                {/* Messages for this date */}
                                {messages.map((message, index) => {
                                    const isOwnMessage = message.senderId === currentUserId;
                                    const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;

                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex gap-3 mb-4 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                                        >
                                            {/* Avatar */}
                                            <div className="flex-shrink-0">
                                                {showAvatar ? (
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className={isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-accent'}>
                                                            {getInitials(message.senderId)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ) : (
                                                    <div className="h-8 w-8"></div>
                                                )}
                                            </div>

                                            {/* Message Content */}
                                            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                                {showAvatar && (
                                                    <span className="text-xs text-muted-foreground mb-1">
                                                        {isOwnMessage ? 'You' : getUserName(message.senderId)}
                                                    </span>
                                                )}
                                                <div
                                                    className={`rounded-lg px-4 py-2 ${isOwnMessage
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-accent'
                                                        }`}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                                </div>
                                                <span className="text-xs text-muted-foreground mt-1">
                                                    {formatTime(message.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4">
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="flex-shrink-0">
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={!connected}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || !connected}
                            className="flex-shrink-0"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Send
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
