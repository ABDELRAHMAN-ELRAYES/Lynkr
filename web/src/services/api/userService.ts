import apiClient from './apiClient';

export interface UserResponse {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    country: string;
    role: string;
    created_at: string;
    is_active: boolean;
}

export const userService = {
    // Get all users
    getAllUsers: async () => {
        const response = await apiClient.get<UserResponse[]>('/users');
        return response.data;
    },

    // Get user by ID
    getUserById: async (userId: string) => {
        const response = await apiClient.get<UserResponse>(`/users/${userId}`);
        return response.data;
    },

    // Get users by role (for admin dashboard - pending providers list)
    getUsersByRole: async (role: string) => {
        const response = await apiClient.get<UserResponse[]>(`/users/role/${role}`);
        return response.data;
    },

    // Approve pending provider
    approveProvider: async (userId: string) => {
        const response = await apiClient.patch<UserResponse>(`/users/${userId}/approve`);
        return response.data;
    },

    // Reject pending provider
    rejectProvider: async (userId: string) => {
        const response = await apiClient.patch<UserResponse>(`/users/${userId}/reject`);
        return response.data;
    },

    // Delete user
    deleteUser: async (userId: string) => {
        const response = await apiClient.delete(`/users/${userId}`);
        return response.data;
    },

    // Create user
    createUser: async (userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        country: string;
        role: string;
        isActive: boolean;
    }) => {
        const response = await apiClient.post<UserResponse>('/users', userData);
        return response.data;
    },

    // Update user
    updateUser: async (userId: string, userData: {
        firstName: string;
        lastName: string;
        email: string;
        password?: string;
        country: string;
        role: string;
        isActive: boolean;
    }) => {
        const response = await apiClient.put<UserResponse>(`/users/${userId}`, userData);
        return response.data;
    },
};
