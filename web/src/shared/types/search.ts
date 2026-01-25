// ============================================
// Search & Discovery Types - Aligned with Backend
// ============================================

import type { ProviderProfile } from './profile';

export type SortBy = 'name' | 'rating' | 'price' | 'date';
export type SortOrder = 'asc' | 'desc';

export interface SearchParams {
    q?: string;              // Search by name
    serviceId?: string;      // Filter by service
    minPrice?: number;       // Min hourly rate
    maxPrice?: number;       // Max hourly rate
    minRating?: number;      // Min average rating
    language?: string;       // Language filter
    sortBy?: SortBy;
    sortOrder?: SortOrder;
    page?: number;
    limit?: number;
}

export interface SearchResult {
    profiles: ProviderProfile[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface SearchFilters {
    serviceId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    language?: string;
}
