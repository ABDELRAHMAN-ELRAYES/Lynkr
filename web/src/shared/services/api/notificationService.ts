import apiClient from './apiClient';

export interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    createdAt: string;
    readAt?: string;
}

export const notificationService = {
    // Get recent notifications
    getRecent: async (limit: number = 10) => {
        const userId = localStorage.getItem('userId');
        const response = await apiClient.get<{ success: boolean; data: Notification[] }>(
            `/notifications/recent?limit=${limit}`,
            { headers: { 'X-User-Id': userId } }
        );
        return response.data.data;
    },

    // Get unread count
    getUnreadCount: async () => {
        const userId = localStorage.getItem('userId');
        const response = await apiClient.get<{ success: boolean; data: number }>(
            '/notifications/unread/count',
            { headers: { 'X-User-Id': userId } }
        );
        return response.data.data;
    },

    // Get unread notifications
    getUnread: async () => {
        const userId = localStorage.getItem('userId');
        const response = await apiClient.get<{ success: boolean; data: Notification[] }>(
            '/notifications/unread',
            { headers: { 'X-User-Id': userId } }
        );
        return response.data.data;
    },

    // Mark as read
    markAsRead: async (notificationId: string) => {
        const userId = localStorage.getItem('userId');
        const response = await apiClient.post(
            `/notifications/${notificationId}/read`,
            {},
            { headers: { 'X-User-Id': userId } }
        );
        return response.data;
    },

    // Mark all as read
    markAllAsRead: async () => {
        const userId = localStorage.getItem('userId');
        const response = await apiClient.post(
            '/notifications/read-all',
            {},
            { headers: { 'X-User-Id': userId } }
        );
        return response.data;
    },

    // Get all notifications
    getAll: async () => {
        const userId = localStorage.getItem('userId');
        const response = await apiClient.get<{ success: boolean; data: Notification[] }>(
            '/notifications',
            { headers: { 'X-User-Id': userId } }
        );
        return response.data.data;
    },
};
