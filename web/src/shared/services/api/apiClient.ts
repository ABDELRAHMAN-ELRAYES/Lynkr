import axios from 'axios';

// Ensure the base URL always includes /api/v1
const envBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_BASE_URL = envBaseUrl.endsWith('/api/v1') ? envBaseUrl : `${envBaseUrl}/api/v1`;
console.log('[apiClient] Using base URL:', API_BASE_URL);

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Enable cookies for auth
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            // Only redirect to login if not already on login page to avoid refresh loop
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
