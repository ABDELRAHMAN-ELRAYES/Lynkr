import apiClient from './apiClient';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    country: string;
    role?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
        };
    };
}

export const authService = {
    // Register new user
    register: async (data: RegisterData) => {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },
    // Login user - Backend returns UserResponse directly, not wrapped
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient.post('/auth/login', credentials);

        // Backend returns UserResponse directly: {id, firstName, lastName, email, role, country, ...}
        const userData = response.data;

        // If we got user data, login was successful
        if (userData && userData.id) {
            // Store auth data (token is set via httpOnly cookie by backend)
            localStorage.setItem('userId', userData.id);
            localStorage.setItem('userEmail', userData.email);
            localStorage.setItem('userRole', userData.role);

            return {
                success: true,
                message: "You logged in successfully",
                data: {
                    user: userData,
                    token: '' // Token is in httpOnly cookie, not accessible from JS
                }
            };
        }

        return {
            success: false,
            message: "Login failed",
            data: null
        };
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    },

    // Verify email
    verifyEmail: async (token: string) => {
        const response = await apiClient.get(`/auth/verify-email/${token}`);
        return response.data;
    },

    // Get current user
    getCurrentUser: () => {
        const userId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');

        if (!userId) return null;

        return {
            id: userId,
            email: userEmail,
            role: userRole,
        };
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};
