import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../utils/catch-async";
import ReviewService from "./review.service";

// ===== PROJECT REVIEWS =====

export const submitProjectReview = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { projectId } = request.params;
        const { rating, comment } = request.body;
        const reviewerId = (request.user as any).id;

        const review = await ReviewService.submitProjectReview(
            reviewerId,
            projectId,
            rating,
            comment,
            next
        );

        if (!review) return;

        response.status(201).json({
            status: "success",
            message: "Project review submitted successfully",
            data: { review }
        });
    }
);

// ===== SESSION REVIEWS =====

export const submitSessionReview = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { sessionId } = request.params;
        const { rating, comment } = request.body;
        const reviewerId = (request.user as any).id;

        const review = await ReviewService.submitSessionReview(
            reviewerId,
            sessionId,
            rating,
            comment,
            next
        );

        if (!review) return;

        response.status(201).json({
            status: "success",
            message: "Session review submitted successfully",
            data: { review }
        });
    }
);

// ===== GET REVIEWS =====

export const getMyReviewsGiven = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const userId = (request.user as any).id;
        const reviews = await ReviewService.getMyReviewsGiven(userId);

        response.status(200).json({
            status: "success",
            results: reviews.length,
            data: { reviews }
        });
    }
);

export const getMyReviewsReceived = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const userId = (request.user as any).id;
        const reviews = await ReviewService.getMyReviewsReceived(userId);

        response.status(200).json({
            status: "success",
            results: reviews.length,
            data: { reviews }
        });
    }
);

export const getProviderReviews = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const { providerUserId } = request.params;
        const reviews = await ReviewService.getProviderReviews(providerUserId);

        response.status(200).json({
            status: "success",
            results: reviews.length,
            data: { reviews }
        });
    }
);

export const getReviewById = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const review = await ReviewService.getReviewById(id, next);

        if (!review) return;

        response.status(200).json({
            status: "success",
            data: { review }
        });
    }
);

// ===== ELIGIBILITY CHECKS =====

export const checkProjectReviewEligibility = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { projectId } = request.params;
        const userId = (request.user as any).id;

        const eligibility = await ReviewService.checkProjectReviewEligibility(
            userId,
            projectId,
            next
        );

        if (!eligibility) return;

        response.status(200).json({
            status: "success",
            data: { eligibility }
        });
    }
);

export const checkSessionReviewEligibility = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { sessionId } = request.params;
        const userId = (request.user as any).id;

        const eligibility = await ReviewService.checkSessionReviewEligibility(
            userId,
            sessionId,
            next
        );

        if (!eligibility) return;

        response.status(200).json({
            status: "success",
            data: { eligibility }
        });
    }
);
