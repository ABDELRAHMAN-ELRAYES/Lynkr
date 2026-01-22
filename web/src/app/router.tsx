import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  PendingProviderRoute,
  PublicRoute,
  ProtectedRoute,
  AdminRoute,
} from "@/shared/hooks/use-routes";

// Home
import HomePage from "@/features/home/pages/HomePage";

// Auth
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import ForgotPasswordPage from "@/features/auth/pages/forget-password";
import ResetPasswordPage from "@/features/auth/pages/reset-password";
import OTPVerificationPage from "@/features/auth/pages/register-verification";
import ClientProviderPage from "@/features/auth/pages/client-or-provider";
import ProviderApplyPage from "@/features/auth/pages/provider-signup-process";
import GoogleOAuthCallbackPage from "@/features/auth/pages/GoogleOAuthCallbackPage";

// Admin
import AdminLayout from "@/features/admin/pages/AdminLayout";
import DashboardPage from "@/features/admin/pages/dashboard/DashboardPage";
import UsersPage from "@/features/admin/pages/users/UsersPage";
import ProjectsPage from "@/features/admin/pages/projects/ProjectsPage";
import OrdersPage from "@/features/admin/pages/orders/OrdersPage";
import PaymentsPage from "@/features/admin/pages/payments/PaymentsPage";
import AnalyticsPage from "@/features/admin/pages/analytics/AnalyticsPage";
import SettingsPage from "@/features/admin/pages/settings/SettingsPage";

// Profile
import ProfileLayout from "@/shared/components/layout/ProfileLayout";
import Profile from "@/features/profile/components/Profile";
import ServicesPricing from "@/features/profile/components/ServicesPricing";
import Portfolio from "@/features/profile/components/Portfolio";
import Availability from "@/features/profile/components/Availability";
import Documents from "@/features/profile/components/Documents";
import Finance from "@/features/profile/components/Finance";
import SettingsSection from "@/features/profile/components/Settings";

// Services
import ServicesPage from "@/features/services/pages/ServicesPage";

// Operations
import OperationsPage from "@/features/operations/pages/OperationsPage";

// Project
import ProjectDetails from "@/features/project/pages/ProjectPage";

// Payment
import SuccessPayment from "@/features/payment/pages/payment-page";
import CancelPayment from "@/features/payment/pages/cancel-payment";

// App
import NotFoundPage from "@/app/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "payments", element: <PaymentsPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "/operations",
    element: <OperationsPage />,
  },
  {
    path: "/services",
    element: <ServicesPage />,
  },
  {
    path: "/operation",
    element: <ProjectDetails />,
  },
  {
    path: "/success",
    element: <SuccessPayment />,
  },
  {
    path: "/cancel",
    element: <CancelPayment />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfileLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Profile />,
      },
      {
        path: "services",
        element: <ServicesPricing />,
      },
      {
        path: "portfolio",
        element: <Portfolio />,
      },
      {
        path: "availability",
        element: <Availability />,
      },
      {
        path: "documents",
        element: <Documents />,
      },
      {
        path: "finance",
        element: <Finance />,
      },
      {
        path: "settings",
        element: <SettingsSection />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register-verification",
    element: (
      <PublicRoute>
        <OTPVerificationPage />
      </PublicRoute>
    ),
  },
  {
    path: "/forget-password",
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <ResetPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: "/auth/callback",
    element: <GoogleOAuthCallbackPage />,
  },
  {
    path: "/client-or-provider",
    element: (
      <PublicRoute>
        <ClientProviderPage />
      </PublicRoute>
    ),
  },
  {
    path: "/provider-application",
    element: (
      <PendingProviderRoute>
        <ProviderApplyPage />
      </PendingProviderRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
