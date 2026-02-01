import { apiClient } from './api-client';
import type {
    ProviderAvailability,
    SaveAvailabilityPayload,
    AvailabilityResponse,
} from '@/shared/types/teaching';

// ============================================
// Availability Service - API Integration Layer
// ============================================

export const teachingService = {
    // ==========================================
    // Availability Management
    // ==========================================

    /**
     * Save all availabilities for the authenticated provider
     */
    saveAvailabilities: async (payload: SaveAvailabilityPayload): Promise<ProviderAvailability[]> => {
        const data = await apiClient({
            url: '/availability',
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return data.data;
    },

    /**
     * Get authenticated provider's own availabilities
     */
    getMyAvailabilities: async (): Promise<ProviderAvailability[]> => {
        const data = await apiClient({
            url: '/availability/my',
            options: { method: 'GET' },
        });
        return data.data || [];
    },

    /**
     * Get provider's public availabilities
     */
    getProviderAvailabilities: async (providerId: string): Promise<ProviderAvailability[]> => {
        const data = await apiClient({
            url: `/availability/provider/${providerId}`,
            options: { method: 'GET' },
        });
        return data.data || [];
    },

    /**
     * Delete a specific availability
     */
    deleteAvailability: async (id: string): Promise<void> => {
        await apiClient({
            url: `/availability/${id}`,
            options: { method: 'DELETE' },
        });
    },
};

