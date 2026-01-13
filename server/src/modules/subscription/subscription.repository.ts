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

    // TODO: Add Plan and Subscription models to Prisma schema
    async getAllPlans(): Promise<object[]> {
        throw new AppError(501, "Subscription module not implemented");
    }

    async createSubscription(_data: object): Promise<object> {
        throw new AppError(501, "Subscription module not implemented");
    }

    async getAllSubscriptions(): Promise<object[]> {
        throw new AppError(501, "Subscription module not implemented");
    }

    async getSubscriptionById(_id: string): Promise<object | null> {
        throw new AppError(501, "Subscription module not implemented");
    }

    async updateSubscription(_id: string, _data: object): Promise<object> {
        throw new AppError(501, "Subscription module not implemented");
    }
}

export default SubscriptionRepository;
