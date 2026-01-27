import { apiClient } from '@/shared/services/api-client';
import type {
    Meeting,
    CreateMeetingPayload,
    JoinTokenResponse,
} from '@/shared/types/project';

export const meetingService = {
    /**
     * Get all meetings for the current user
     */
    getUserMeetings: async (): Promise<Meeting[]> => {
        const response = await apiClient({
            url: '/meetings/me',
            options: { method: 'GET' },
        });
        return response.data?.meetings || response.data;
    },

    /**
     * Get meetings for a specific project
     */
    getProjectMeetings: async (projectId: string): Promise<Meeting[]> => {
        const response = await apiClient({
            url: `/meetings/project/${projectId}`,
            options: { method: 'GET' },
        });
        return response.data?.meetings || response.data;
    },

    /**
     * Get a specific meeting by ID
     */
    getMeetingById: async (id: string): Promise<Meeting> => {
        const response = await apiClient({
            url: `/meetings/${id}`,
            options: { method: 'GET' },
        });
        return response.data?.meeting || response.data;
    },

    /**
     * Create a new meeting (instant or scheduled)
     */
    createMeeting: async (payload: CreateMeetingPayload): Promise<Meeting> => {
        const response = await apiClient({
            url: '/meetings',
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return response.data?.meeting || response.data;
    },

    /**
     * Get token to join a meeting (Agora token)
     */
    getJoinToken: async (meetingId: string): Promise<JoinTokenResponse> => {
        const response = await apiClient({
            url: `/meetings/${meetingId}/token`,
            options: { method: 'GET' },
        });
        return response.data;
    },

    /**
     * Start a meeting (host only)
     */
    startMeeting: async (id: string): Promise<Meeting> => {
        const response = await apiClient({
            url: `/meetings/${id}/start`,
            options: { method: 'PATCH' },
        });
        return response.data?.meeting || response.data;
    },

    /**
     * End a meeting (host only)
     */
    endMeeting: async (id: string): Promise<Meeting> => {
        const response = await apiClient({
            url: `/meetings/${id}/end`,
            options: { method: 'PATCH' },
        });
        return response.data?.meeting || response.data;
    },

    /**
     * Accept a meeting invitation
     */
    acceptMeeting: async (id: string): Promise<Meeting> => {
        const response = await apiClient({
            url: `/meetings/${id}/accept`,
            options: { method: 'PATCH' },
        });
        return response.data?.meeting || response.data;
    },

    /**
     * Decline a meeting invitation
     */
    declineMeeting: async (id: string): Promise<Meeting> => {
        const response = await apiClient({
            url: `/meetings/${id}/decline`,
            options: { method: 'PATCH' },
        });
        return response.data?.meeting || response.data;
    },

    /**
     * Cancel a scheduled meeting (host only)
     */
    cancelMeeting: async (id: string): Promise<void> => {
        await apiClient({
            url: `/meetings/${id}`,
            options: { method: 'DELETE' },
        });
    },
};
