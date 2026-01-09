import apiClient from './apiClient';

export interface Role {
    id: string;
    name: string;
    description: string;
    isSystemRole: boolean;
    createdAt: string;
}

export interface Permission {
    id: string;
    name: string;
    resource: string;
    action: string;
    description: string;
}

export const rbacService = {
    // Get all roles
    getAllRoles: async () => {
        const response = await apiClient.get<{ success: boolean; data: Role[] }>('/admin/roles');
        return response.data.data;
    },

    // Get user roles
    getUserRoles: async (userId: string) => {
        const response = await apiClient.get<{ success: boolean; data: Role[] }>(
            `/admin/users/${userId}/roles`
        );
        return response.data.data;
    },

    // Get user permissions
    getUserPermissions: async (userId: string) => {
        const response = await apiClient.get<{ success: boolean; data: Permission[] }>(
            `/admin/users/${userId}/permissions`
        );
        return response.data.data;
    },

    // Check if user is admin
    isAdmin: async (userId: string) => {
        const response = await apiClient.get<{ success: boolean; data: { isAdmin: boolean } }>(
            `/admin/users/${userId}/is-admin`
        );
        return response.data.data.isAdmin;
    },

    // Assign role to user
    assignRole: async (userId: string, roleId: string) => {
        const adminId = localStorage.getItem('userId');
        const response = await apiClient.post(
            `/admin/users/${userId}/roles/${roleId}`,
            {},
            { headers: { 'X-User-Id': adminId } }
        );
        return response.data;
    },

    // Remove role from user
    removeRole: async (userId: string, roleId: string) => {
        const response = await apiClient.delete(`/admin/users/${userId}/roles/${roleId}`);
        return response.data;
    },

    // Create role
    createRole: async (roleData: Partial<Role>) => {
        const response = await apiClient.post('/admin/roles', roleData);
        return response.data;
    },

    // Delete role
    deleteRole: async (roleId: string) => {
        const response = await apiClient.delete(`/admin/roles/${roleId}`);
        return response.data;
    },
};
