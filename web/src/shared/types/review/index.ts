// Review types aligned with backend schema (single rating model)

export interface Review {
    id: string;
    reviewerId: string;
    targetUserId: string;
    rating: number; // 1-5 stars
    reviewType: 'CLIENT_TO_PROVIDER' | 'PROVIDER_TO_CLIENT';
    status: 'SUBMITTED' | 'EXPIRED';
    comment?: string;
    createdAt: string;
    updatedAt: string;
    // Relationships
    projectReview?: {
        id: string;
        projectId: string;
        project?: {
            id: string;
            title?: string;
        };
    };
    sessionReview?: {
        id: string;
        sessionId: string;
    };
    reviewer?: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
    targetUser?: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
}

export interface CreateProjectReviewPayload {
    rating: number; // 1-5
    comment?: string;
}

export interface CreateSessionReviewPayload {
    rating: number; // 1-5
    comment?: string;
}

export interface ReviewEligibility {
    eligible: boolean;
    reason?: string;
    existingReview?: Review;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    starDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}
