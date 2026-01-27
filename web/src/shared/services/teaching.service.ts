import { apiClient } from './api-client';
import type {
    TeachingSlot,
    TeachingSession,
    CreateSlotPayload,
    UpdateSlotPayload,
    BookSessionResponse,
    SessionVideoInfo,
} from '@/shared/types/teaching';

// ============================================
// Teaching Service - API Integration Layer
// ============================================

export const teachingService = {
    // ==========================================
    // Slot Management
    // ==========================================

    /**
     * Create a single availability slot
     */
    createSlot: async (payload: CreateSlotPayload): Promise<TeachingSlot> => {
        const data = await apiClient({
            url: '/teaching/slots',
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return data.data;
    },

    /**
     * Create multiple slots (bulk creation)
     */
    createMultipleSlots: async (slots: CreateSlotPayload[]): Promise<TeachingSlot[]> => {
        const data = await apiClient({
            url: '/teaching/slots/bulk',
            options: {
                method: 'POST',
                body: JSON.stringify({ slots }),
            },
        });
        return data.data;
    },

    /**
     * Get instructor's own slots
     */
    getMySlots: async (): Promise<TeachingSlot[]> => {
        const data = await apiClient({
            url: '/teaching/slots/my',
            options: { method: 'GET' },
        });
        return data.data || [];
    },

    /**
     * Get provider's public available slots (for students)
     */
    getProviderSlots: async (providerId: string): Promise<TeachingSlot[]> => {
        const data = await apiClient({
            url: `/teaching/slots/provider/${providerId}`,
            options: { method: 'GET' },
        });
        return data.data || [];
    },

    /**
     * Get a single slot by ID
     */
    getSlotById: async (id: string): Promise<TeachingSlot> => {
        const data = await apiClient({
            url: `/teaching/slots/${id}`,
            options: { method: 'GET' },
        });
        return data.data;
    },

    /**
     * Update a slot (only if not booked)
     */
    updateSlot: async (id: string, payload: UpdateSlotPayload): Promise<TeachingSlot> => {
        const data = await apiClient({
            url: `/teaching/slots/${id}`,
            options: {
                method: 'PATCH',
                body: JSON.stringify(payload),
            },
        });
        return data.data;
    },

    /**
     * Delete a slot (only if not booked)
     */
    deleteSlot: async (id: string): Promise<void> => {
        await apiClient({
            url: `/teaching/slots/${id}`,
            options: { method: 'DELETE' },
        });
    },

    // ==========================================
    // Session Management
    // ==========================================

    /**
     * Book a slot - initiates payment
     */
    bookSession: async (slotId: string): Promise<BookSessionResponse> => {
        const data = await apiClient({
            url: '/teaching/sessions/book',
            options: {
                method: 'POST',
                body: JSON.stringify({ slotId }),
            },
        });
        return data.data;
    },

    /**
     * Confirm booking after payment
     */
    confirmBooking: async (slotId: string, paymentId: string): Promise<TeachingSession> => {
        const data = await apiClient({
            url: '/teaching/sessions/confirm',
            options: {
                method: 'POST',
                body: JSON.stringify({ slotId, paymentId }),
            },
        });
        return data.data;
    },

    /**
     * Get student's booked sessions
     */
    getMySessions: async (): Promise<TeachingSession[]> => {
        const data = await apiClient({
            url: '/teaching/sessions/my',
            options: { method: 'GET' },
        });
        return data.data || [];
    },

    /**
     * Get instructor's sessions
     */
    getInstructorSessions: async (): Promise<TeachingSession[]> => {
        const data = await apiClient({
            url: '/teaching/sessions/instructor',
            options: { method: 'GET' },
        });
        return data.data || [];
    },

    /**
     * Get session by ID
     */
    getSessionById: async (id: string): Promise<TeachingSession> => {
        const data = await apiClient({
            url: `/teaching/sessions/${id}`,
            options: { method: 'GET' },
        });
        return data.data;
    },

    /**
     * Start a session (instructor only)
     */
    startSession: async (id: string): Promise<TeachingSession & { videoInfo: SessionVideoInfo }> => {
        const data = await apiClient({
            url: `/teaching/sessions/${id}/start`,
            options: { method: 'PATCH' },
        });
        return data.data;
    },

    /**
     * Complete a session (instructor only)
     */
    completeSession: async (id: string): Promise<TeachingSession> => {
        const data = await apiClient({
            url: `/teaching/sessions/${id}/complete`,
            options: { method: 'PATCH' },
        });
        return data.data;
    },

    /**
     * Cancel a session
     */
    cancelSession: async (id: string): Promise<TeachingSession> => {
        const data = await apiClient({
            url: `/teaching/sessions/${id}/cancel`,
            options: { method: 'PATCH' },
        });
        return data.data;
    },

    /**
     * Join an active session
     */
    joinSession: async (id: string): Promise<{ videoInfo: SessionVideoInfo }> => {
        const data = await apiClient({
            url: `/teaching/sessions/${id}/join`,
            options: { method: 'POST' },
        });
        return data.data;
    },

    /**
     * Leave a session
     */
    leaveSession: async (id: string): Promise<void> => {
        await apiClient({
            url: `/teaching/sessions/${id}/leave`,
            options: { method: 'POST' },
        });
    },
};
