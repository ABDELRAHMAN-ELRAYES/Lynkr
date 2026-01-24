import { apiClient, apiFormClient } from './api-client';
import type {
    ProviderProfile,
    ProviderApplication,
    CreateFullProfileRequest,
    UpdateProfilePayload,
    ProfileRequestWithFullData,
    Education,
    CreateEducationPayload,
    UpdateEducationPayload,
    Experience,
    CreateExperiencePayload,
    UpdateExperiencePayload,
} from '@/shared/types/profile';

// ============================================
// Profile Service - API Integration Layer
// ============================================

export const profileService = {
    // ============================================
    // Profile CRUD Operations
    // ============================================

    /**
     * Get current user's profile
     */
    getMyProfile: async (): Promise<ProviderProfile> => {
        const data = await apiClient({
            url: '/providers/me',
            options: { method: 'GET' },
        });
        return data.data?.profile || data.profile || data.data || data;
    },

    /**
     * Get provider profile by ID
     */
    getProfileById: async (profileId: string): Promise<ProviderProfile> => {
        const data = await apiClient({
            url: `/providers/${profileId}`,
            options: { method: 'GET' },
        });
        return data.data?.profile || data.profile || data.data || data;
    },

    /**
     * Get provider profile by user ID
     */
    getProfileByUserId: async (userId: string): Promise<ProviderProfile> => {
        const data = await apiClient({
            url: `/providers/user/${userId}`,
            options: { method: 'GET' },
        });
        return data.data?.profile || data.profile || data.data || data;
    },

    /**
     * Create full provider profile (used during onboarding)
     */
    createFullProfile: async (payload: CreateFullProfileRequest, formData?: FormData): Promise<ProviderProfile> => {
        if (formData) {
            // Add JSON payload fields to FormData
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined) {
                    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
                }
            });
            const data = await apiFormClient({
                url: '/providers/full',
                options: { method: 'POST' },
                formData,
            });
            return data.data?.profile || data.profile || data.data || data;
        }

        const data = await apiClient({
            url: '/providers/full',
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return data.data?.profile || data.profile || data.data || data;
    },

    /**
     * Update provider profile
     */
    updateProfile: async (profileId: string, payload: UpdateProfilePayload): Promise<ProviderProfile> => {
        const data = await apiClient({
            url: `/providers/${profileId}`,
            options: {
                method: 'PUT',
                body: JSON.stringify(payload),
            },
        });
        return data.data?.profile || data.profile || data.data || data;
    },

    /**
     * Submit profile join request (provider onboarding)
     */
    submitProfileJoinRequest: async (payload: CreateFullProfileRequest): Promise<ProviderProfile> => {
        const data = await apiClient({
            url: '/providers/full',
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return data.data?.profile || data.profile || data.data || data;
    },

    // ============================================
    // Provider Application Operations
    // ============================================

    /**
     * Get current user's application history
     */
    getMyApplications: async (): Promise<ProviderApplication[]> => {
        const data = await apiClient({
            url: '/provider-applications/me',
            options: { method: 'GET' },
        });
        return data.data || data || [];
    },

    /**
     * Submit a new provider application (for reapplication after rejection)
     */
    submitApplication: async (): Promise<ProviderApplication> => {
        const data = await apiClient({
            url: '/provider-applications',
            options: { method: 'POST' },
        });
        return data.data || data;
    },

    // ============================================
    // Admin Operations (Profile Requests)
    // ============================================

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
    ): Promise<{ message: string }> => {
        const data = await apiClient({
            url: `/providers/requests/${requestId}/evaluate`,
            options: {
                method: 'POST',
                body: JSON.stringify({ decision, adminNotes }),
            },
        });
        return data.data || data;
    },

    // ============================================
    // Education CRUD Operations
    // ============================================

    /**
     * Get educations by profile ID
     */
    getEducationsByProfile: async (profileId: string): Promise<Education[]> => {
        const data = await apiClient({
            url: `/provider/education/profile/${profileId}`,
            options: { method: 'GET' },
        });
        return data.data || data || [];
    },

    /**
     * Create a new education entry
     */
    createEducation: async (payload: CreateEducationPayload): Promise<Education> => {
        const data = await apiClient({
            url: '/provider/education',
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return data.data || data;
    },

    /**
     * Update an education entry
     */
    updateEducation: async (educationId: string, payload: UpdateEducationPayload): Promise<Education> => {
        const data = await apiClient({
            url: `/provider/education/${educationId}`,
            options: {
                method: 'PUT',
                body: JSON.stringify(payload),
            },
        });
        return data.data || data;
    },

    /**
     * Delete an education entry
     */
    deleteEducation: async (educationId: string): Promise<void> => {
        await apiClient({
            url: `/provider/education/${educationId}`,
            options: { method: 'DELETE' },
        });
    },

    // ============================================
    // Experience CRUD Operations
    // ============================================

    /**
     * Get experiences by profile ID
     */
    getExperiencesByProfile: async (profileId: string): Promise<Experience[]> => {
        const data = await apiClient({
            url: `/provider/experience/profile/${profileId}`,
            options: { method: 'GET' },
        });
        return data.data || data || [];
    },

    /**
     * Create a new experience entry
     */
    createExperience: async (payload: CreateExperiencePayload): Promise<Experience> => {
        const data = await apiClient({
            url: '/provider/experience',
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return data.data || data;
    },

    /**
     * Update an experience entry
     */
    updateExperience: async (experienceId: string, payload: UpdateExperiencePayload): Promise<Experience> => {
        const data = await apiClient({
            url: `/provider/experience/${experienceId}`,
            options: {
                method: 'PUT',
                body: JSON.stringify(payload),
            },
        });
        return data.data || data;
    },

    /**
     * Delete an experience entry
     */
    deleteExperience: async (experienceId: string): Promise<void> => {
        await apiClient({
            url: `/provider/experience/${experienceId}`,
            options: { method: 'DELETE' },
        });
    },
};
