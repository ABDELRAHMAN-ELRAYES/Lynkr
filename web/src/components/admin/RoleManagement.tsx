import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useRBAC } from '@/hooks/useRBAC';
import axios from 'axios';
import { Shield, Users, Key, Plus, Trash2, Edit } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface Role {
    id: string;
    name: string;
    description: string;
    isSystemRole: boolean;
    createdAt: string;
}

interface Permission {
    id: string;
    name: string;
    resource: string;
    action: string;
    description: string;
}

export function RoleManagement() {
    const userId = localStorage.getItem('userId');
    const { isAdmin, isSuperAdmin } = useRBAC(userId);

    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    useEffect(() => {
        if (isAdmin) {
            fetchRoles();
            fetchPermissions();
        }
    }, [isAdmin]);

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/roles`);
            if (response.data.success) {
                setRoles(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/permissions`);
            if (response.data.success) {
                setPermissions(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const handleDeleteRole = async (roleId: string, isSystemRole: boolean) => {
        if (isSystemRole) {
            alert('Cannot delete system roles');
            return;
        }

        if (!confirm('Are you sure you want to delete this role?')) {
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/admin/roles/${roleId}`);
            fetchRoles();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to delete role');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
                    <p className="text-muted-foreground">Manage user roles and permissions</p>
                </div>
                {isSuperAdmin() && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Role
                    </Button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{roles.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {roles.filter(r => r.isSystemRole).length} system roles
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Permissions</CardTitle>
                        <Key className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{permissions.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all resources
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Custom Roles</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {roles.filter(r => !r.isSystemRole).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Created by admins
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Roles List */}
            <Card>
                <CardHeader>
                    <CardTitle>Roles</CardTitle>
                    <CardDescription>All available roles in the system</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{role.name}</h3>
                                        {role.isSystemRole && (
                                            <Badge variant="secondary">System</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {role.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Created: {new Date(role.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedRole(role)}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        View Permissions
                                    </Button>

                                    {!role.isSystemRole && isSuperAdmin() && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteRole(role.id, role.isSystemRole)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Selected Role Permissions */}
            {selectedRole && (
                <Card>
                    <CardHeader>
                        <CardTitle>Permissions for {selectedRole.name}</CardTitle>
                        <CardDescription>
                            Manage what users with this role can do
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="flex items-center space-x-2 p-3 border rounded-md"
                                >
                                    <input
                                        type="checkbox"
                                        id={permission.id}
                                        className="h-4 w-4 rounded border-gray-300"
                                    // Add logic to check if role has this permission
                                    />
                                    <label
                                        htmlFor={permission.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {permission.name}
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {permission.description}
                                        </p>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
