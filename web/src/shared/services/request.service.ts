import { apiClient, apiFormClient } from './api-client';
import type {
    Request,
    CreateRequestPayload,
    UpdateRequestPayload,
} from '@/shared/types/request';

// ============================================
// Request Service - API Integration Layer
// ============================================

export const requestService = {
    /**
     * Create a new request (direct or public)
     */
    createRequest: async (payload: CreateRequestPayload): Promise<Request> => {
        const formData = new FormData();

        // Add files if provided
        if (payload.files && payload.files.length > 0) {
            payload.files.forEach((file) => {
                formData.append('files', file);
            });
        }

        // Create operation object with all request data
        const operation = {
            providerId: payload.providerId,
            title: payload.title,
            description: payload.description,
            category: payload.category,
            budgetType: payload.budgetType,
            budgetCurrency: payload.budgetCurrency || 'USD',
            fromBudget: payload.fromBudget,
            toBudget: payload.toBudget,
            deadline: payload.deadline,
            ndaChecked: payload.ndaChecked || false,
            enableAutoPublish: payload.enableAutoPublish !== undefined ? payload.enableAutoPublish : true,
        };

        formData.append('operation', JSON.stringify(operation));

        const data = await apiFormClient({
            url: '/requests',
            options: { method: 'POST' },
            formData,
        });

        return data.data || data;
    },

    /**
     * Get all requests (client view: own requests, provider view: available requests)
     */
    getRequests: async (): Promise<Request[]> => {
        const data = await apiClient({
            url: '/requests',
            options: { method: 'GET' },
        });
        return data.data || [];
    },

    /**
     * Get paginated public requests for providers
     */
    getPublicRequests: async (params: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
    } = {}): Promise<{
        data: Request[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }> => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.category) queryParams.append('category', params.category);
        if (params.search) queryParams.append('search', params.search);

        const response = await apiClient({
            url: `/requests/public?${queryParams.toString()}`,
            options: { method: 'GET' },
        });

        return {
            data: response.data || [],
            pagination: response.pagination || {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0,
            },
        };
    },

    /**
     * Get request by ID
     */
    getRequestById: async (id: string): Promise<Request> => {
        const data = await apiClient({
            url: `/requests/${id}`,
            options: { method: 'GET' },
        });
        return data.data || data;
    },

    /**
     * Update request (Draft/Pending only)
     */
    updateRequest: async (id: string, payload: UpdateRequestPayload): Promise<Request> => {
        const formData = new FormData();

        // Add files if provided
        if (payload.files && payload.files.length > 0) {
            payload.files.forEach((file) => {
                formData.append('files', file);
            });
        }

        // Add other fields
        Object.keys(payload).forEach((key) => {
            if (key !== 'files' && payload[key as keyof UpdateRequestPayload] !== undefined) {
                formData.append(key, String(payload[key as keyof UpdateRequestPayload]));
            }
        });

        const data = await apiFormClient({
            url: `/requests/${id}`,
            options: { method: 'PUT' },
            formData,
        });

        return data.data || data;
    },

    /**
     * Cancel request
     */
    cancelRequest: async (id: string): Promise<Request> => {
        const data = await apiClient({
            url: `/requests/${id}/cancel`,
            options: { method: 'POST' },
        });
        return data.data || data;
    },

    /**
     * Provider accepts a request
     */
    acceptRequest: async (id: string): Promise<Request> => {
        const data = await apiClient({
            url: `/requests/${id}/accept`,
            options: { method: 'POST' },
        });
        return data.data || data;
    },

    /**
     * Provider rejects a request
     */
    rejectRequest: async (id: string): Promise<Request> => {
        const data = await apiClient({
            url: `/requests/${id}/reject`,
            options: { method: 'POST' },
        });
        return data.data || data;
    },
};
