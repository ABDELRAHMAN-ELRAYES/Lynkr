import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";

class SubscriptionRepository {
    private prisma: PrismaClient;
    static instance: SubscriptionRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): SubscriptionRepository {
        if (!SubscriptionRepository.instance) {
            SubscriptionRepository.instance = new SubscriptionRepository();
        }
        return SubscriptionRepository.instance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    async getAllPlans(): Promise<any[]> {
        try {
            return await this.prisma.plan.findMany();
        } catch (error) {
            throw new AppError(500, "Failed to get plans");
        }
    }

    async createSubscription(data: any): Promise<any> {
        try {
            return await this.prisma.subscription.create({ data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to create subscription");
        }
    }

    async getAllSubscriptions(): Promise<any[]> {
        try {
            return await this.prisma.subscription.findMany();
        } catch (error) {
            throw new AppError(500, "Failed to get subscriptions");
        }
    }

    async getSubscriptionById(id: string): Promise<any> {
        try {
            return await this.prisma.subscription.findUnique({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to get subscription");
        }
    }

    async updateSubscription(id: string, data: any): Promise<any> {
        try {
            return await this.prisma.subscription.update({ where: { id }, data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to update subscription");
        }
    }
}

export default SubscriptionRepository;
