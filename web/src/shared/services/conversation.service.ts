import { apiClient } from '@/shared/services/api-client';
import type { Conversation } from '@/shared/types/project';

export const conversationService = {
    /**
     * Get all conversations for the current user
     */
    getUserConversations: async (): Promise<Conversation[]> => {
        const response = await apiClient({
            url: '/conversations',
            options: { method: 'GET' },
        });
        return response.data?.conversations || response.data;
    },

    /**
     * Get a specific conversation by ID
     */
    getConversationById: async (id: string): Promise<Conversation> => {
        const response = await apiClient({
            url: `/conversations/${id}`,
            options: { method: 'GET' },
        });
        return response.data?.conversation || response.data;
    },

    /**
     * Get conversation for a specific project
     */
    getConversationByProjectId: async (
        projectId: string
    ): Promise<Conversation> => {
        const response = await apiClient({
            url: `/conversations/project/${projectId}`,
            options: { method: 'GET' },
        });
        return response.data?.conversation || response.data;
    },
};
