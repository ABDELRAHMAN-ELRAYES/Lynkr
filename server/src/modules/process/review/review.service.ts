import ReviewRepository from "./review.repository";
import { NextFunction } from "express";
import AppError from "../../../utils/app-error";
import { ReviewType } from "./types/IReview";

class ReviewService {
    private static repository = ReviewRepository.getInstance();

    // ===== PROJECT REVIEWS =====

    static async submitProjectReview(
        reviewerId: string,
        projectId: string,
        rating: number,
        comment: string | undefined,
        next: NextFunction
    ) {
        // Validate rating range
        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            return next(new AppError(400, "Rating must be an integer between 1 and 5"));
        }

        // Get project with participants
        const project = await this.repository.getProjectWithParticipants(projectId);
        if (!project) {
            return next(new AppError(404, "Project not found"));
        }

        // Check if project is completed
        if (project.status !== "COMPLETED") {
            return next(new AppError(400, "Can only review completed projects"));
        }

        // Determine review type and target user
        let reviewType: ReviewType;
        let targetUserId: string;

        if (reviewerId === project.clientId) {
            // Client reviewing provider
            reviewType = "CLIENT_TO_PROVIDER";
            targetUserId = project.providerProfile.userId;
        } else if (reviewerId === project.providerProfile.userId) {
            // Provider reviewing client
            reviewType = "PROVIDER_TO_CLIENT";
            targetUserId = project.clientId;
        } else {
            return next(new AppError(403, "You are not a participant in this project"));
        }

        // Check for existing review
        const existingReview = await this.repository.getExistingProjectReview(reviewerId, projectId);
        if (existingReview) {
            return next(new AppError(400, "You have already reviewed this project"));
        }

        // Create the review
        const review = await this.repository.createProjectReview({
            reviewerId,
            targetUserId,
            projectId,
            rating,
            comment,
            reviewType
        });

        // Update provider rating stats if this is a client-to-provider review
        if (reviewType === "CLIENT_TO_PROVIDER") {
            await this.updateProviderRatingStats(project.providerProfile.id, targetUserId);
        }

        return review;
    }

    // ===== SESSION REVIEWS =====

    static async submitSessionReview(
        reviewerId: string,
        sessionId: string,
        rating: number,
        comment: string | undefined,
        next: NextFunction
    ) {
        // Validate rating range
        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            return next(new AppError(400, "Rating must be an integer between 1 and 5"));
        }

        // Get session with participants
        const session = await this.repository.getSessionWithParticipants(sessionId);
        if (!session) {
            return next(new AppError(404, "Session not found"));
        }

        // Check if session is completed
        if (session.status !== "COMPLETED") {
            return next(new AppError(400, "Can only review completed sessions"));
        }

        const instructorUserId = session.slot.providerProfile.userId;
        const participantUserIds = session.participants.map(p => p.userId);

        // Determine review type and target user
        let reviewType: ReviewType;
        let targetUserId: string;

        if (participantUserIds.includes(reviewerId)) {
            // Participant reviewing instructor (provider)
            reviewType = "CLIENT_TO_PROVIDER";
            targetUserId = instructorUserId;
        } else if (reviewerId === instructorUserId) {
            return next(new AppError(400, "Instructors cannot review participants in Phase 1"));
        } else {
            return next(new AppError(403, "You are not a participant in this session"));
        }

        // Check for existing review
        const existingReview = await this.repository.getExistingSessionReview(reviewerId, sessionId);
        if (existingReview) {
            return next(new AppError(400, "You have already reviewed this session"));
        }

        // Create the review
        const review = await this.repository.createSessionReview({
            reviewerId,
            targetUserId,
            sessionId,
            rating,
            comment,
            reviewType
        });

        // Update provider rating stats
        if (reviewType === "CLIENT_TO_PROVIDER") {
            await this.updateProviderRatingStats(session.slot.providerProfile.id, targetUserId);
        }

        return review;
    }

    // ===== GET REVIEWS =====

    static async getMyReviewsGiven(userId: string) {
        return await this.repository.getReviewsGivenByUser(userId);
    }

    static async getMyReviewsReceived(userId: string) {
        return await this.repository.getReviewsReceivedByUser(userId);
    }

    static async getProviderReviews(providerUserId: string) {
        return await this.repository.getProviderReviews(providerUserId);
    }

    static async getReviewById(id: string, next: NextFunction) {
        const review = await this.repository.getReviewById(id);
        if (!review) {
            return next(new AppError(404, "Review not found"));
        }
        return review;
    }

    // ===== ELIGIBILITY CHECKS =====

    static async checkProjectReviewEligibility(
        userId: string,
        projectId: string,
        next: NextFunction
    ) {
        const project = await this.repository.getProjectWithParticipants(projectId);
        if (!project) {
            return next(new AppError(404, "Project not found"));
        }

        // Check if user is participant
        const isClient = userId === project.clientId;
        const isProvider = userId === project.providerProfile.userId;

        if (!isClient && !isProvider) {
            return {
                canReview: false,
                reason: "You are not a participant in this project",
                engagementType: "PROJECT" as const,
                engagementId: projectId
            };
        }

        // Check if project is completed
        if (project.status !== "COMPLETED") {
            return {
                canReview: false,
                reason: "Project must be completed before you can submit a review",
                engagementType: "PROJECT" as const,
                engagementId: projectId
            };
        }

        // Check for existing review
        const existingReview = await this.repository.getExistingProjectReview(userId, projectId);
        if (existingReview) {
            return {
                canReview: false,
                reason: "You have already reviewed this project",
                engagementType: "PROJECT" as const,
                engagementId: projectId
            };
        }

        return {
            canReview: true,
            engagementType: "PROJECT" as const,
            engagementId: projectId
        };
    }

    static async checkSessionReviewEligibility(
        userId: string,
        sessionId: string,
        next: NextFunction
    ) {
        const session = await this.repository.getSessionWithParticipants(sessionId);
        if (!session) {
            return next(new AppError(404, "Session not found"));
        }

        const participantUserIds = session.participants.map(p => p.userId);
        const isParticipant = participantUserIds.includes(userId);

        if (!isParticipant) {
            return {
                canReview: false,
                reason: "You are not a participant in this session",
                engagementType: "SESSION" as const,
                engagementId: sessionId
            };
        }

        // Check if session is completed
        if (session.status !== "COMPLETED") {
            return {
                canReview: false,
                reason: "Session must be completed before you can submit a review",
                engagementType: "SESSION" as const,
                engagementId: sessionId
            };
        }

        // Check for existing review
        const existingReview = await this.repository.getExistingSessionReview(userId, sessionId);
        if (existingReview) {
            return {
                canReview: false,
                reason: "You have already reviewed this session",
                engagementType: "SESSION" as const,
                engagementId: sessionId
            };
        }

        return {
            canReview: true,
            engagementType: "SESSION" as const,
            engagementId: sessionId
        };
    }

    // ===== RATING AGGREGATION =====

    private static async updateProviderRatingStats(providerProfileId: string, providerUserId: string) {
        const stats = await this.repository.getProviderRatingStats(providerUserId);

        if (stats.averageRating !== null) {
            await this.repository.updateProviderRatingStats(
                providerProfileId,
                stats.averageRating,
                stats.totalReviews
            );
        }
    }
}

export default ReviewService;
