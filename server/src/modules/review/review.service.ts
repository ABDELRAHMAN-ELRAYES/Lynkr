import ReviewRepository from "./review.repository";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";

class ReviewService {
    private static repository = ReviewRepository.getInstance();

    static async createReview(data: object, _next: NextFunction) {
        return await this.repository.createReview(data);
    }

    static async getAllReviews() {
        return await this.repository.getAllReviews();
    }

    static async getReviewById(id: string, next: NextFunction) {
        const review = await this.repository.getReviewById(id);
        if (!review) {
            next(new AppError(404, "Review not found"));
            return;
        }
        return review;
    }

    static async updateReview(id: string, data: object, _next: NextFunction) {
        return await this.repository.updateReview(id, data);
    }

    static async deleteReview(id: string, _next: NextFunction) {
        return await this.repository.deleteReview(id);
    }
}

export default ReviewService;
