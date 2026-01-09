import apiClient from './apiClient';

export interface Message {
    id: string;
    operationId: string;
    senderId: string;
    content: string;
    messageType: string;
    fileUrl?: string;
    createdAt: string;
}

export interface MessageRequest {
    operationId: string;
    senderId: string;
    content: string;
    messageType: string;
}

export const messageService = {
    // Get messages for operation
    getOperationMessages: async (operationId: string) => {
        const response = await apiClient.get<{ success: boolean; data: Message[] }>(
            `/messages/operation/${operationId}`
        );
        return response.data.data;
    },

    // Get recent messages
    getRecentMessages: async (operationId: string, limit: number = 50) => {
        const response = await apiClient.get<{ success: boolean; data: Message[] }>(
            `/messages/operation/${operationId}/recent?limit=${limit}`
        );
        return response.data.data;
    },

    // Get message count
    getMessageCount: async (operationId: string) => {
        const response = await apiClient.get<{ success: boolean; data: number }>(
            `/messages/operation/${operationId}/count`
        );
        return response.data.data;
    },

    // Save message (alternative to WebSocket)
    saveMessage: async (messageData: MessageRequest) => {
        const response = await apiClient.post<{ success: boolean; data: Message }>(
            '/messages',
            messageData
        );
        return response.data.data;
    },

    // Delete message
    deleteMessage: async (messageId: string) => {
        const response = await apiClient.delete(`/messages/${messageId}`);
        return response.data;
    },
};
