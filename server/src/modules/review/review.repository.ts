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

    async createReview(data: any): Promise<any> {
        try {
            return await this.prisma.review.create({ data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to create review");
        }
    }

    async getAllReviews(): Promise<any[]> {
        try {
            return await this.prisma.review.findMany();
        } catch (error) {
            throw new AppError(500, "Failed to get reviews");
        }
    }

    async getReviewById(id: string): Promise<any> {
        try {
            return await this.prisma.review.findUnique({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to get review");
        }
    }

    async updateReview(id: string, data: any): Promise<any> {
        try {
            return await this.prisma.review.update({ where: { id }, data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to update review");
        }
    }

    async deleteReview(id: string): Promise<any> {
        try {
            return await this.prisma.review.delete({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to delete review");
        }
    }
}

export default ReviewRepository;
