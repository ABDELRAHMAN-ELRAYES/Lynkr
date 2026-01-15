// Search & Discovery Types

import { IProfileResponse } from "./IProfile";

export type SortBy = "name" | "rating" | "price" | "date";
export type SortOrder = "asc" | "desc";

export interface ISearchParams {
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

export interface ISearchResult {
    profiles: IProfileResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Repository layer requires page and limit to be non-optional
export interface ISearchParamsRequired extends Omit<ISearchParams, "page" | "limit"> {
    page: number;
    limit: number;
}
