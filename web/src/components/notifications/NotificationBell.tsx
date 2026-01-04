import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWebSocket } from '@/hooks/useWebSocket';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    createdAt: string;
    readAt?: string;
}

export function NotificationBell() {
    const userId = localStorage.getItem('userId');
    const { notifications: realtimeNotifications } = useWebSocket(userId);

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchNotifications();
            fetchUnreadCount();
        }
    }, [userId]);

    // Add realtime notifications to the list
    useEffect(() => {
        if (realtimeNotifications.length > 0) {
            const latestNotification = realtimeNotifications[0];
            setNotifications((prev) => [latestNotification as any, ...prev]);
            setUnreadCount((prev) => prev + 1);
        }
    }, [realtimeNotifications]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/notifications/recent?limit=10`, {
                headers: { 'X-User-Id': userId },
            });
            if (response.data.success) {
                setNotifications(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/notifications/unread/count`, {
                headers: { 'X-User-Id': userId },
            });
            if (response.data.success) {
                setUnreadCount(response.data.data || 0);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await axios.post(`${API_BASE_URL}/notifications/${notificationId}/read`, {}, {
                headers: { 'X-User-Id': userId },
            });

            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, readAt: new Date().toISOString() } : n
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(`${API_BASE_URL}/notifications/read-all`, {}, {
                headers: { 'X-User-Id': userId },
            });

            setNotifications((prev) =>
                prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        const icons: Record<string, string> = {
            ORDER_UPDATE: '📦',
            PAYMENT_RECEIVED: '💰',
            NEW_MESSAGE: '💬',
            MEETING_REMINDER: '📅',
            SYSTEM: '🔔',
        };
        return icons[type] || '🔔';
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-primary hover:underline"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </Button>
                    )}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <ScrollArea className="h-[400px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.readAt ? 'bg-accent/50' : ''
                                    }`}
                                onClick={() => {
                                    if (!notification.readAt) {
                                        markAsRead(notification.id);
                                    }
                                    if (notification.link) {
                                        window.location.href = notification.link;
                                    }
                                }}
                            >
                                <span className="text-2xl flex-shrink-0">
                                    {getNotificationIcon(notification.type)}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium leading-none mb-1">
                                        {notification.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatTimeAgo(notification.createdAt)}
                                    </p>
                                </div>
                                {!notification.readAt && (
                                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="justify-center text-sm text-primary hover:underline cursor-pointer">
                    View all notifications
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
