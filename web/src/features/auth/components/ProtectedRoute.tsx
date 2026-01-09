import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useRBAC } from '@/shared/hooks/useRBAC';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string;
    requiredPermission?: string;
    requiredAnyRole?: string[];
    requiredAnyPermission?: string[];
    requireAdmin?: boolean;
    fallbackPath?: string;
}

export function ProtectedRoute({
    children,
    requiredRole,
    requiredPermission,
    requiredAnyRole,
    requiredAnyPermission,
    requireAdmin = false,
    fallbackPath = '/login',
}: ProtectedRouteProps) {
    // Get user ID from auth context/store (you'll need to implement this)
    const userId = localStorage.getItem('userId'); // Temporary - replace with proper auth

    const { loading, hasRole, hasPermission, hasAnyRole, hasAnyPermission, isAdmin } = useRBAC(userId);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!userId) {
        return <Navigate to={fallbackPath} replace />;
    }

    // Check admin requirement
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Check specific role requirement
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Check any of the roles
    if (requiredAnyRole && !hasAnyRole(...requiredAnyRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Check specific permission requirement
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Check any of the permissions
    if (requiredAnyPermission && !hasAnyPermission(...requiredAnyPermission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}
