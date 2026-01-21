import { apiClient } from './api-client';

import { UserResponse, CreateUserPayload, UpdateUserPayload } from '@/shared/types/user';

// ============================================
// User Service
// ============================================

export const userService = {
    /**
     * Get all users (admin)
     */
    getAllUsers: async (): Promise<UserResponse[]> => {
        const data = await apiClient({
            url: '/users',
            options: { method: 'GET' },
        });
        return data.data || data || [];
    },

    /**
     * Get a single user by ID
     */
    getUserById: async (id: string): Promise<UserResponse> => {
        const data = await apiClient({
            url: `/users/${id}`,
            options: { method: 'GET' },
        });
        return data.data || data;
    },

    /**
     * Create a new user (admin)
     */
    createUser: async (payload: CreateUserPayload): Promise<UserResponse> => {
        const data = await apiClient({
            url: '/users',
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return data.data || data;
    },

    /**
     * Update a user
     */
    updateUser: async (id: string, payload: UpdateUserPayload): Promise<UserResponse> => {
        const data = await apiClient({
            url: `/users/${id}`,
            options: {
                method: 'PUT',
                body: JSON.stringify(payload),
            },
        });
        return data.data || data;
    },

    /**
     * Delete a user
     */
    deleteUser: async (id: string): Promise<void> => {
        await apiClient({
            url: `/users/${id}`,
            options: { method: 'DELETE' },
        });
    },

    /**
     * Get user statistics (admin)
     */
    getStatistics: async () => {
        const data = await apiClient({
            url: '/users/statistics',
            options: { method: 'GET' },
        });
        return data.data || data;
    },
};
