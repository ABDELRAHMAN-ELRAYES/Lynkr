// Review Types for Module 8: Ratings & Reviews

export type ReviewType = "CLIENT_TO_PROVIDER" | "PROVIDER_TO_CLIENT";
export type ReviewStatus = "SUBMITTED" | "EXPIRED";

// Base review interface
export interface IReview {
    id: string;
    reviewerId: string;
    targetUserId: string;
    rating: number;
    comment?: string | null;
    reviewType: ReviewType;
    status: ReviewStatus;
    createdAt: Date;
    updatedAt: Date;
    projectReview?: IProjectReview | null;
    sessionReview?: ISessionReview | null;
}

// Project review join table
export interface IProjectReview {
    id: string;
    reviewId: string;
    projectId: string;
}

// Session review join table
export interface ISessionReview {
    id: string;
    reviewId: string;
    sessionId: string;
}

// Input for creating a project review
export interface ICreateProjectReviewData {
    reviewerId: string;
    targetUserId: string;
    projectId: string;
    rating: number;
    comment?: string;
    reviewType: ReviewType;
}

// Input for creating a session review
export interface ICreateSessionReviewData {
    reviewerId: string;
    targetUserId: string;
    sessionId: string;
    rating: number;
    comment?: string;
    reviewType: ReviewType;
}

// Review response with extended data
export interface IReviewWithDetails extends IReview {
    reviewer?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    targetUser?: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

// Provider rating stats
export interface IProviderRatingStats {
    averageRating: number | null;
    totalReviews: number;
}

// Review eligibility check result
export interface IReviewEligibility {
    canReview: boolean;
    reason?: string;
    engagementType: "PROJECT" | "SESSION";
    engagementId: string;
}
