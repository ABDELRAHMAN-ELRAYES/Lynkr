import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./use-auth";
import { useEffect, useState, type ReactNode } from "react";
import { LoadingModal } from "@/shared/components/common/loading-modal";

// -----------------------------
// ProtectedRoute
// -----------------------------
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowLoadingModal(true);
      const timer = setTimeout(() => {
        setShowLoadingModal(false);
        setShouldRedirect(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading || showLoadingModal) return <LoadingModal />;
  if (shouldRedirect) return <Navigate to="/login" replace />;

  return isAuthenticated ? <>{children}</> : null;
};

// -----------------------------
// PublicRoute
// -----------------------------
export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // ✅ Allow OTP verification route temporarily even for authenticated users
      const isOtpVerificationRoute = location.pathname === "/otp-verification";

      if (isOtpVerificationRoute) return; // ✅ Skip redirect logic

      // Case 1: Pending Provider — only allow provider-application
      if (user?.role === "PENDING_PROVIDER") {
        if (location.pathname !== "/provider-application") {
          setShowLoadingModal(true);
          const timer = setTimeout(() => {
            setShowLoadingModal(false);
            setRedirectPath("/provider-application");
          }, 1500);
          return () => clearTimeout(timer);
        }
      } else {
        // Case 2: Other authenticated users — redirect home
        setShowLoadingModal(true);
        const timer = setTimeout(() => {
          setShowLoadingModal(false);
          setRedirectPath("/");
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, isLoading, user?.role, location.pathname]);

  if (isLoading || showLoadingModal) return <LoadingModal />;
  if (redirectPath) return <Navigate to={redirectPath} replace />;

  // Allow unauthenticated users or specific pending provider flow
  const canAccess =
    !isAuthenticated ||
    (user?.role === "PENDING_PROVIDER" &&
      location.pathname === "/provider-application") ||
    location.pathname === "/otp-verification"; // ✅ Always allow OTP

  return canAccess ? <>{children}</> : null;
};

// -----------------------------
// PendingProviderRoute
// -----------------------------
export const PendingProviderRoute = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      // Only PENDING_PROVIDER can access
      if (!isAuthenticated || user?.role !== "PENDING_PROVIDER") {
        setShowLoadingModal(true);
        const timer = setTimeout(() => {
          setShowLoadingModal(false);
          setRedirectPath("/");
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, isLoading, user?.role]);

  if (isLoading || showLoadingModal) return <LoadingModal />;
  if (redirectPath) return <Navigate to={redirectPath} replace />;

  return user?.role === "PENDING_PROVIDER" ? <>{children}</> : null;
};

// -----------------------------
// AdminRoute - Only ADMIN or SUPER_ADMIN can access
// -----------------------------
export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setShowLoadingModal(true);
        const timer = setTimeout(() => {
          setShowLoadingModal(false);
          setRedirectPath("/login");
        }, 1500);
        return () => clearTimeout(timer);
      }

      if (!isAdmin) {
        setShowLoadingModal(true);
        const timer = setTimeout(() => {
          setShowLoadingModal(false);
          setRedirectPath("/");
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, isLoading, isAdmin]);

  if (isLoading || showLoadingModal) return <LoadingModal />;
  if (redirectPath) return <Navigate to={redirectPath} replace />;

  return isAdmin ? <>{children}</> : null;
};

// -----------------------------
// RoleBasedRoute - Allow specific roles
// -----------------------------
interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export const RoleBasedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/"
}: RoleBasedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const hasAccess = user?.role && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setShowLoadingModal(true);
        const timer = setTimeout(() => {
          setShowLoadingModal(false);
          setRedirectPath("/login");
        }, 1500);
        return () => clearTimeout(timer);
      }

      if (!hasAccess) {
        setShowLoadingModal(true);
        const timer = setTimeout(() => {
          setShowLoadingModal(false);
          setRedirectPath(redirectTo);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, isLoading, hasAccess, redirectTo]);

  if (isLoading || showLoadingModal) return <LoadingModal />;
  if (redirectPath) return <Navigate to={redirectPath} replace />;

  return hasAccess ? <>{children}</> : null;
};
