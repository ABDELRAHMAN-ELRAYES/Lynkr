import apiClient from './apiClient';

export interface AgoraToken {
    token: string;
    appId: string;
    channelName: string;
    expiresIn: string;
}

export const agoraService = {
    // Generate RTC token
    generateToken: async (channelName: string, userId?: string) => {
        const params = new URLSearchParams({ channelName });
        if (userId) {
            params.append('userId', userId);
        }

        const response = await apiClient.get<{ success: boolean; data: AgoraToken }>(
            `/meetings/token?${params.toString()}`
        );
        return response.data.data;
    },

    // Get Agora config
    getConfig: async () => {
        const response = await apiClient.get<{ success: boolean; data: { appId: string } }>(
            '/meetings/config'
        );
        return response.data.data;
    },

    // Validate channel name
    validateChannelName: async (channelName: string) => {
        const response = await apiClient.get<{ success: boolean; data: { isValid: boolean } }>(
            `/meetings/validate-channel?channelName=${channelName}`
        );
        return response.data.data.isValid;
    },
};
