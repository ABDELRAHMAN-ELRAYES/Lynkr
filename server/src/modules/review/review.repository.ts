import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";

class ReviewRepository {
    private prisma: PrismaClient;
    static instance: ReviewRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): ReviewRepository {
        if (!ReviewRepository.instance) {
            ReviewRepository.instance = new ReviewRepository();
        }
        return ReviewRepository.instance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    // TODO: Add Review model to Prisma schema
    async createReview(_data: object): Promise<object> {
        throw new AppError(501, "Review module not implemented");
    }

    async getAllReviews(): Promise<object[]> {
        throw new AppError(501, "Review module not implemented");
    }

    async getReviewById(_id: string): Promise<object | null> {
        throw new AppError(501, "Review module not implemented");
    }

    async updateReview(_id: string, _data: object): Promise<object> {
        throw new AppError(501, "Review module not implemented");
    }

    async deleteReview(_id: string): Promise<object> {
        throw new AppError(501, "Review module not implemented");
    }
}

export default ReviewRepository;
