import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import OperationsPage from "./pages/OperationsPage";
import ServicesPage from "./pages/ServicesPage";
import ProjectDetails from "./pages/ProjectPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/auth/LoginPage";
import Signup from "./pages/auth/SignupPage";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Profile from "./components/pages/profile/Profile";
import NotFoundPage from "./pages/NotFoundPage";
import ProfileLayout from "./components/layout/ProfileLayout";
import ServicesPricing from "./components/pages/profile/ServicesPricing";
import Portfolio from "./components/pages/profile/Portfolio";
import Availability from "./components/pages/profile/Availability";
import Documents from "./components/pages/profile/Documents";
import Finance from "./components/pages/profile/Finance";
import SettingsSection from "./components/pages/profile/Settings";
import ForgotPasswordPage from "./pages/auth/forget-password";
import ResetPasswordPage from "./pages/auth/reset-password";
import OTPVerificationPage from "./pages/auth/register-verification";
import ClientProviderPage from "./pages/auth/client-or-provider";
import ProviderApplyPage from "./pages/auth/provider-signup-process";
import SuccessPayment from "./pages/payment/payment-page";
import CancelPayment from "./pages/payment/cancel-payment";
import { AuthProvider } from "./hooks/use-auth";
import { PendingProviderRoute, PublicRoute, ProtectedRoute, AdminRoute } from "./hooks/use-routes";

// Admin imports
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/pages/DashboardPage";
import UsersPage from "./pages/admin/pages/UsersPage";
import ProjectsPage from "./pages/admin/pages/ProjectsPage";
import OrdersPage from "./pages/admin/pages/OrdersPage";
import PaymentsPage from "./pages/admin/pages/PaymentsPage";
import AnalyticsPage from "./pages/admin/pages/AnalyticsPage";
import SettingsPage from "./pages/admin/pages/SettingsPage";

const router = createBrowserRouter([
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
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <SonnerToaster position="top-right" richColors />
      <Toaster />
    </AuthProvider>
  </StrictMode>
);
