import { apiClient } from '@/shared/services/api-client';
import type { Message, MessagesResponse, SendMessagePayload } from '@/shared/types/project';

export const messageService = {
    /**
     * Get messages for a conversation (paginated)
     */
    getMessagesByConversation: async (
        conversationId: string,
        page: number = 1,
        limit: number = 50
    ): Promise<MessagesResponse> => {
        const response = await apiClient({
            url: `/messages/conversation/${conversationId}?page=${page}&limit=${limit}`,
            options: { method: 'GET' },
        });
        return response.data;
    },

    /**
     * Send a new message to a conversation
     */
    sendMessage: async (payload: SendMessagePayload): Promise<Message> => {
        const response = await apiClient({
            url: '/messages',
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return response.data?.message || response.data;
    },

    /**
     * Mark a single message as read
     */
    markMessageAsRead: async (messageId: string): Promise<Message> => {
        const response = await apiClient({
            url: `/messages/${messageId}/read`,
            options: { method: 'PATCH' },
        });
        return response.data?.message || response.data;
    },

    /**
     * Mark all messages in a conversation as read
     */
    markConversationAsRead: async (
        conversationId: string
    ): Promise<{ count: number }> => {
        const response = await apiClient({
            url: `/messages/conversation/${conversationId}/read`,
            options: { method: 'PATCH' },
        });
        return response.data;
    },
};
