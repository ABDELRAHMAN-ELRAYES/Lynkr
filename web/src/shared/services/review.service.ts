import { apiClient } from './api-client';
import type {
    Review,
    CreateProjectReviewPayload,
    CreateSessionReviewPayload,
    ReviewEligibility,
    ReviewStats,
} from '../types/review';

// ============================================
// Review Service - API Integration Layer
// ============================================

export const reviewService = {
    /**
     * Submit a project review
     */
    createProjectReview: async (
        projectId: string,
        payload: CreateProjectReviewPayload
    ): Promise<Review> => {
        const response = await apiClient({
            url: `/reviews/projects/${projectId}`,
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return response.data.review || response.data;
    },

    /**
     * Submit a session review
     */
    createSessionReview: async (
        sessionId: string,
        payload: CreateSessionReviewPayload
    ): Promise<Review> => {
        const response = await apiClient({
            url: `/reviews/sessions/${sessionId}`,
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return response.data.review || response.data;
    },

    /**
     * Get reviews submitted by the current user
     */
    getReviewsGiven: async (): Promise<Review[]> => {
        const response = await apiClient({
            url: '/reviews/given',
            options: { method: 'GET' },
        });
        return response.data.reviews || response.data || [];
    },

    /**
     * Get reviews received by the current user
     */
    getReviewsReceived: async (): Promise<Review[]> => {
        const response = await apiClient({
            url: '/reviews/received',
            options: { method: 'GET' },
        });
        return response.data.reviews || response.data || [];
    },

    /**
     * Get public reviews for a provider
     */
    getProviderReviews: async (providerUserId: string): Promise<Review[]> => {
        const response = await apiClient({
            url: `/reviews/provider/${providerUserId}`,
            options: { method: 'GET' },
        });
        return response.data.reviews || response.data || [];
    },

    /**
     * Get a single review by ID
     */
    getReviewById: async (id: string): Promise<Review> => {
        const response = await apiClient({
            url: `/reviews/${id}`,
            options: { method: 'GET' },
        });
        return response.data.review || response.data;
    },

    /**
     * Check if user is eligible to review a project
     */
    checkProjectEligibility: async (projectId: string): Promise<ReviewEligibility> => {
        const response = await apiClient({
            url: `/reviews/projects/${projectId}/eligibility`,
            options: { method: 'GET' },
        });
        return response.data;
    },

    /**
     * Check if user is eligible to review a session
     */
    checkSessionEligibility: async (sessionId: string): Promise<ReviewEligibility> => {
        const response = await apiClient({
            url: `/reviews/sessions/${sessionId}/eligibility`,
            options: { method: 'GET' },
        });
        return response.data;
    },

    /**
     * Calculate review statistics from a list of reviews
     */
    calculateStats: (reviews: Review[]): ReviewStats => {
        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                starDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            };
        }

        const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = ratingSum / reviews.length;

        const starDistribution = reviews.reduce(
            (acc, review) => {
                const roundedRating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
                acc[roundedRating]++;
                return acc;
            },
            { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        );

        return {
            averageRating,
            totalReviews: reviews.length,
            starDistribution,
        };
    },
};
