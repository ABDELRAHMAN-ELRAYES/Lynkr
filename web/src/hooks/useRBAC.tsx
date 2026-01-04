import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface Role {
    id: string;
    name: string;
    description: string;
    isSystemRole: boolean;
}

interface Permission {
    id: string;
    name: string;
    resource: string;
    action: string;
    description: string;
}

export function useRBAC(userId: string | null) {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchRBAC = async () => {
            try {
                setLoading(true);

                // Fetch user roles
                const rolesResponse = await axios.get(`${API_BASE_URL}/admin/users/${userId}/roles`);
                if (rolesResponse.data.success) {
                    setRoles(rolesResponse.data.data || []);
                }

                // Fetch user permissions
                const permissionsResponse = await axios.get(`${API_BASE_URL}/admin/users/${userId}/permissions`);
                if (permissionsResponse.data.success) {
                    setPermissions(permissionsResponse.data.data || []);
                }

                // Check if admin
                const adminResponse = await axios.get(`${API_BASE_URL}/admin/users/${userId}/is-admin`);
                if (adminResponse.data.success) {
                    setIsAdmin(adminResponse.data.data?.isAdmin || false);
                }
            } catch (error) {
                console.error('Error fetching RBAC data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRBAC();
    }, [userId]);

    const hasRole = (roleName: string): boolean => {
        return roles.some(role => role.name === roleName);
    };

    const hasAnyRole = (...roleNames: string[]): boolean => {
        return roles.some(role => roleNames.includes(role.name));
    };

    const hasPermission = (permissionName: string): boolean => {
        return permissions.some(permission => permission.name === permissionName);
    };

    const hasAnyPermission = (...permissionNames: string[]): boolean => {
        return permissions.some(permission => permissionNames.includes(permission.name));
    };

    const isSuperAdmin = (): boolean => {
        return hasRole('SUPER_ADMIN');
    };

    return {
        roles,
        permissions,
        isAdmin,
        loading,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission,
        isSuperAdmin,
    };
}
