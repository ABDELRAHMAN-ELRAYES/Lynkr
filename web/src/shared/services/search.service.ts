// ============================================
// Provider Search Service - API Integration Layer
// ============================================

import { apiClient } from './api-client';
import type { SearchParams, SearchResult } from '@/shared/types/search';

export const searchService = {
    /**
     * Search provider profiles with filters, sorting, and pagination
     */
    searchProviderProfiles: async (params: SearchParams): Promise<SearchResult> => {
        // Build query string
        const queryParams = new URLSearchParams();

        if (params.q) queryParams.append('q', params.q);
        if (params.serviceId) queryParams.append('serviceId', params.serviceId);
        if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
        if (params.minRating !== undefined) queryParams.append('minRating', params.minRating.toString());
        if (params.language) queryParams.append('language', params.language);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const queryString = queryParams.toString();
        const url = `/providers/search${queryString ? `?${queryString}` : ''}`;

        const data = await apiClient({
            url,
            options: { method: 'GET' },
            skipErrorToast: true, // Handle errors in component
        });

        // Backend returns: { status: "success", data: { profiles, total, page, limit, totalPages } }
        return data.data || data;
    },
};
