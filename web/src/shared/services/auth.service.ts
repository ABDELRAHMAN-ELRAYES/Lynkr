import { apiClient } from './api-client';

// ============================================
// Types
// ============================================

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            country?: string;
            role: string;
            privileges?: string[];
            allowedTabs?: string[];
        };
    };
}

export interface RegisterPayload {
    email: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data?: {
        email: string;
        otp: string;
    };
}

export interface RegisterVerificationPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    country: string;
    role: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ForgotPasswordResponse {
    success: boolean;
    message: string;
    data?: {
        message: string;
    };
}

export interface ResetPasswordPayload {
    token: string;
    password: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
    data?: {
        user: {
            id: string;
            email: string;
        };
    };
}

// ============================================
// Auth Service
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const authService = {
    /**
     * Login with email and password
     */
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        try {
            const data = await apiClient({
                url: '/auth/login',
                options: {
                    method: 'POST',
                    body: JSON.stringify(payload),
                },
                skipErrorToast: true,
            });

            return {
                success: true,
                message: data.message || 'Login successful',
                data: {
                    token: data.data?.token,
                    user: {
                        id: data.data?.user?.id,
                        firstName: data.data?.user?.first_name || data.data?.user?.firstName,
                        lastName: data.data?.user?.last_name || data.data?.user?.lastName,
                        email: data.data?.user?.email,
                        country: data.data?.user?.country,
                        role: data.data?.user?.role,
                        privileges: data.data?.user?.privileges,
                        allowedTabs: data.data?.user?.allowedTabs,
                    },
                },
            };
        } catch (error: unknown) {
            const err = error as { message?: string; response?: { data?: { message?: string } } };
            return {
                success: false,
                message: err.response?.data?.message || err.message || 'Login failed',
            };
        }
    },

    /**
     * Initiate registration - sends OTP to email
     */
    register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
        try {
            const data = await apiClient({
                url: '/auth/register',
                options: {
                    method: 'POST',
                    body: JSON.stringify(payload),
                },
                skipErrorToast: true,
            });

            return {
                success: true,
                message: data.message || 'Verification email sent',
                data: {
                    email: data.data?.email,
                    otp: data.data?.otp,
                },
            };
        } catch (error: unknown) {
            const err = error as { message?: string; response?: { data?: { message?: string } } };
            return {
                success: false,
                message: err.response?.data?.message || err.message || 'Registration failed',
            };
        }
    },

    /**
     * Complete registration after OTP verification
     */
    registerVerification: async (payload: RegisterVerificationPayload) => {
        try {
            const data = await apiClient({
                url: '/auth/register-verification',
                options: {
                    method: 'POST',
                    body: JSON.stringify(payload),
                },
                skipErrorToast: true,
            });

            return {
                success: true,
                message: data.message || 'Registration successful',
                data: data.data,
            };
        } catch (error: unknown) {
            const err = error as { message?: string; response?: { data?: { message?: string } } };
            return {
                success: false,
                message: err.response?.data?.message || err.message || 'Registration verification failed',
            };
        }
    },

    /**
     * Request password reset - sends email with reset link
     */
    forgotPassword: async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
        try {
            const data = await apiClient({
                url: '/auth/forget-password',
                options: {
                    method: 'POST',
                    body: JSON.stringify(payload),
                },
                skipErrorToast: true,
            });

            return {
                success: true,
                message: data.message || 'Password reset email sent',
                data: data.data,
            };
        } catch (error: unknown) {
            const err = error as { message?: string; response?: { data?: { message?: string } } };
            return {
                success: false,
                message: err.response?.data?.message || err.message || 'Failed to send reset email',
            };
        }
    },

    /**
     * Reset password with token from email
     */
    resetPassword: async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
        try {
            const data = await apiClient({
                url: '/auth/reset-password',
                options: {
                    method: 'POST',
                    body: JSON.stringify(payload),
                },
                skipErrorToast: true,
            });

            return {
                success: true,
                message: data.message || 'Password reset successful',
                data: data.data,
            };
        } catch (error: unknown) {
            const err = error as { message?: string; response?: { data?: { message?: string } } };
            return {
                success: false,
                message: err.response?.data?.message || err.message || 'Password reset failed',
            };
        }
    },

    /**
     * Logout the current user
     */
    logout: async () => {
        try {
            await apiClient({
                url: '/auth/logout',
                options: {
                    method: 'POST',
                },
                skipErrorToast: true,
            });

            return {
                success: true,
                message: 'Logged out successfully',
            };
        } catch (error: unknown) {
            const err = error as { message?: string };
            return {
                success: false,
                message: err.message || 'Logout failed',
            };
        }
    },

    /**
     * Get current authenticated user data
     */
    getCurrentUser: async () => {
        try {
            const data = await apiClient({
                url: '/auth/me',
                options: {
                    method: 'GET',
                },
                skipErrorToast: true,
            });

            return {
                success: true,
                data: data.data?.user,
            };
        } catch (error: unknown) {
            return {
                success: false,
                data: null,
            };
        }
    },

    /**
     * Get Google OAuth URL - initiates OAuth flow
     */
    getGoogleAuthUrl: (): string => {
        return `${API_BASE_URL}/auth/google`;
    },
};
