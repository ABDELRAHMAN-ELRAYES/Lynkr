import { apiClient } from './api-client';

import {
    UserResponse,
    CreateUserPayload,
    UpdateUserPayload,
    UserStatistics,
    UserBatchParams,
    UserBatchResponse
} from '@/shared/types/user';

// ============================================
// User Service
// ============================================

export const userService = {
    /**
     * Get all users (admin) - simple list
     */
    getAllUsers: async (): Promise<UserResponse[]> => {
        const data = await apiClient({
            url: '/users',
            options: { method: 'GET' },
        });
        return data.data?.users || data.users || [];
    },

    /**
     * Get batch users with pagination and filters (admin)
     */
    getBatchUsers: async (params: UserBatchParams): Promise<UserBatchResponse> => {
        const queryParams = new URLSearchParams();
        queryParams.append('page', params.page.toString());
        queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.role) queryParams.append('role', params.role);
        if (params.status !== undefined) queryParams.append('status', params.status);

        const data = await apiClient({
            url: `/users/batch?${queryParams.toString()}`,
            options: { method: 'GET' },
        });
        return data.data || data;
    },

    /**
     * Get a single user by ID
     */
    getUserById: async (id: string): Promise<UserResponse> => {
        const data = await apiClient({
            url: `/users/${id}`,
            options: { method: 'GET' },
        });
        return data.data?.user || data.user || data.data || data;
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
        return data.data?.user || data.user || data.data || data;
    },

    /**
     * Update a user
     */
    updateUser: async (id: string, payload: UpdateUserPayload): Promise<UserResponse> => {
        const data = await apiClient({
            url: `/users/${id}`,
            options: {
                method: 'PUT',
                body: JSON.stringify({ data: payload }),
            },
        });
        return data.data?.user || data.user || data.data || data;
    },

    /**
     * Update user status (activate/deactivate)
     */
    updateUserStatus: async (id: string, active: boolean): Promise<void> => {
        await apiClient({
            url: `/users/${id}`,
            options: {
                method: 'PATCH',
                body: JSON.stringify({ active }),
            },
        });
    },

    /**
     * Update user password (admin)
     */
    updateUserPassword: async (id: string, password: string): Promise<void> => {
        await apiClient({
            url: `/users/${id}/password`,
            options: {
                method: 'PATCH',
                body: JSON.stringify({ password }),
            },
        });
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
    getStatistics: async (): Promise<UserStatistics> => {
        const data = await apiClient({
            url: '/users/statistics',
            options: { method: 'GET' },
        });
        return data.data || data;
    },
};

