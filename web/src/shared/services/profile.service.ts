import { apiClient, apiFormClient } from './api-client';

import {
    ProfileRequestWithFullData,
    CreateFullProfileRequest
} from '@/shared/types/profile';


// ============================================
// Profile Service
// ============================================

export const profileService = {
    /**
     * Get current user's profile
     */
    getMyProfile: async () => {
        const data = await apiClient({
            url: '/providers/me',
            options: { method: 'GET' },
        });
        return data.data || data;
    },

    /**
     * Create full provider profile (used during onboarding)
     */
    createFullProfile: async (payload: CreateFullProfileRequest, formData?: FormData) => {
        if (formData) {
            // Add JSON payload fields to FormData
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined) {
                    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
                }
            });
            return apiFormClient({
                url: '/providers/full',
                options: { method: 'POST' },
                formData,
            });
        }

        const data = await apiClient({
            url: '/providers/full',
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return data.data || data;
    },

    /**
     * Get all pending profile requests with full data (admin)
     */
    getPendingProfileRequestsWithFullData: async (): Promise<ProfileRequestWithFullData[]> => {
        const data = await apiClient({
            url: '/providers/requests/pending',
            options: { method: 'GET' },
        });
        return data.data || data || [];
    },

    /**
     * Evaluate a profile request (approve/reject) - admin
     */
    evaluateProfileRequest: async (
        requestId: string,
        decision: 'APPROVED' | 'REJECTED',
        adminNotes?: string
    ) => {
        const data = await apiClient({
            url: `/providers/requests/${requestId}/evaluate`,
            options: {
                method: 'POST',
                body: JSON.stringify({ decision, adminNotes }),
            },
        });
        return data.data || data;
    },

    /**
     * Get provider profile by ID
     */
    getProviderById: async (id: string) => {
        const data = await apiClient({
            url: `/providers/${id}`,
            options: { method: 'GET' },
        });
        return data.data || data;
    },

    /**
     * Update provider profile
     */
    updateProfile: async (payload: Partial<CreateFullProfileRequest>) => {
        const data = await apiClient({
            url: '/providers/me',
            options: {
                method: 'PUT',
                body: JSON.stringify(payload),
            },
        });
        return data.data || data;
    },

    /**
     * Submit profile join request (provider onboarding)
     * This creates the full profile and submits it for admin review
     */
    submitProfileJoinRequest: async (payload: CreateFullProfileRequest) => {
        const data = await apiClient({
            url: '/providers/full',
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return data.data || data;
    },
};
