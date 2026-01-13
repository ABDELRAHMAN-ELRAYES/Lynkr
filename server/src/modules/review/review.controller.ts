import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import ReviewService from "./review.service";

export const createReview = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const review = await ReviewService.createReview(request.body, next);
        response.status(201).json({ status: "success", data: { review } });
    }
);

export const getAllReviews = catchAsync(
    async (_request: Request, response: Response, _next: NextFunction) => {
        const reviews = await ReviewService.getAllReviews();
        response.status(200).json({ status: "success", data: { reviews } });
    }
);

export const getReview = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const review = await ReviewService.getReviewById(request.params.id, next);
        if (!review) return;
        response.status(200).json({ status: "success", data: { review } });
    }
);

export const updateReview = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const review = await ReviewService.updateReview(request.params.id, request.body, next);
        response.status(200).json({ status: "success", data: { review } });
    }
);

export const deleteReview = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        await ReviewService.deleteReview(request.params.id, next);
        response.status(204).json({ status: "success", data: null });
    }
);
