import { apiClient } from "../api-client";

export interface PlatformSettings {
    id: string;
    platformName: string;
    platformCommission: number;
    minWithdrawal: number;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateSettingsData {
    platformName?: string;
    platformCommission?: number;
    minWithdrawal?: number;
}

export interface GetSettingsResponse {
    success: boolean;
    message?: string;
    data?: PlatformSettings;
}

export interface UpdateSettingsResponse {
    success: boolean;
    message?: string;
    data?: PlatformSettings;
}

// ============================================
// Settings Service
// ============================================

export const settingsService = {
    /**
     * Get platform settings
     */
    getSettings: async (): Promise<GetSettingsResponse> => {
        try {
            const data = await apiClient({
                url: '/settings',
                options: {
                    method: 'GET',
                },
                skipErrorToast: true,
            });

            return {
                success: true,
                message: data.message || 'Settings fetched successfully',
                data: data.data?.settings || data.data,
            };
        } catch (error: unknown) {
            const err = error as { message?: string; response?: { data?: { message?: string } } };

            return {
                success: false,
                message: err.response?.data?.message || err.message || 'Failed to fetch settings',
            };
        }
    },

    /**
     * Update platform settings
     */
    updateSettings: async (payload: UpdateSettingsData): Promise<UpdateSettingsResponse> => {
        try {
            const data = await apiClient({
                url: '/settings',
                options: {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                },
                skipErrorToast: true,
            });

            return {
                success: true,
                message: data.message || 'Settings updated successfully',
                data: data.data?.settings || data.data,
            };
        } catch (error: unknown) {
            const err = error as { message?: string; response?: { data?: { message?: string } } };

            return {
                success: false,
                message: err.response?.data?.message || err.message || 'Failed to update settings',
            };
        }
    },
};
