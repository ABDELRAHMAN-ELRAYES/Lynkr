import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";
import {
    ICreatePlanData,
    IUpdatePlanData,
    IPurchaseSubscriptionData,
    SubscriptionStatus
} from "./types/ISubscription";

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

    // ===== PLAN OPERATIONS =====

    async getAllPlans(activeOnly: boolean = true) {
        try {
            const where = activeOnly ? { isActive: true } : {};
            return await this.prisma.subscriptionPlan.findMany({
                where,
                orderBy: { price: "asc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get plans");
        }
    }

    async getPlanById(id: string) {
        try {
            return await this.prisma.subscriptionPlan.findUnique({
                where: { id }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get plan");
        }
    }

    async createPlan(data: ICreatePlanData) {
        try {
            return await this.prisma.subscriptionPlan.create({
                data: {
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    durationDays: data.durationDays,
                    visibilityBoost: data.visibilityBoost || 1
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create plan");
        }
    }

    async updatePlan(id: string, data: IUpdatePlanData) {
        try {
            return await this.prisma.subscriptionPlan.update({
                where: { id },
                data
            });
        } catch (error) {
            throw new AppError(500, "Failed to update plan");
        }
    }

    // ===== SUBSCRIPTION OPERATIONS =====

    async createSubscription(data: IPurchaseSubscriptionData) {
        try {
            return await this.prisma.providerSubscription.create({
                data: {
                    providerProfileId: data.providerProfileId,
                    planId: data.planId
                },
                include: {
                    plan: true
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create subscription");
        }
    }

    async getSubscriptionById(id: string) {
        try {
            return await this.prisma.providerSubscription.findUnique({
                where: { id },
                include: {
                    plan: true,
                    providerProfile: {
                        select: { id: true, userId: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get subscription");
        }
    }

    async getProviderActiveSubscription(providerProfileId: string) {
        try {
            return await this.prisma.providerSubscription.findFirst({
                where: {
                    providerProfileId,
                    status: "ACTIVE"
                },
                include: { plan: true }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get active subscription");
        }
    }

    async getProviderSubscriptions(providerProfileId: string) {
        try {
            return await this.prisma.providerSubscription.findMany({
                where: { providerProfileId },
                include: { plan: true },
                orderBy: { createdAt: "desc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get subscriptions");
        }
    }

    async getAllSubscriptions(page: number = 1, limit: number = 20, status?: SubscriptionStatus) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};

        try {
            const [subscriptions, total] = await Promise.all([
                this.prisma.providerSubscription.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        plan: true,
                        providerProfile: {
                            include: {
                                user: {
                                    select: { id: true, firstName: true, lastName: true, email: true }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: "desc" }
                }),
                this.prisma.providerSubscription.count({ where })
            ]);

            return { subscriptions, total, page, limit, totalPages: Math.ceil(total / limit) };
        } catch (error) {
            throw new AppError(500, "Failed to get all subscriptions");
        }
    }

    async updateSubscription(id: string, data: {
        status?: SubscriptionStatus;
        paymentStatus?: string;
        startDate?: Date;
        endDate?: Date;
    }) {
        try {
            return await this.prisma.providerSubscription.update({
                where: { id },
                data,
                include: { plan: true }
            });
        } catch (error) {
            throw new AppError(500, "Failed to update subscription");
        }
    }

    // ===== EXPIRATION HANDLING =====

    async getExpiredSubscriptions() {
        try {
            return await this.prisma.providerSubscription.findMany({
                where: {
                    status: "ACTIVE",
                    endDate: { lt: new Date() }
                },
                include: {
                    plan: true,
                    providerProfile: {
                        select: { id: true, userId: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get expired subscriptions");
        }
    }

    async getExpiringSubscriptions(daysAhead: number = 3) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);

        try {
            return await this.prisma.providerSubscription.findMany({
                where: {
                    status: "ACTIVE",
                    endDate: {
                        gte: new Date(),
                        lte: futureDate
                    }
                },
                include: {
                    plan: true,
                    providerProfile: {
                        select: { id: true, userId: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get expiring subscriptions");
        }
    }

    async markSubscriptionsExpired(ids: string[]) {
        try {
            return await this.prisma.providerSubscription.updateMany({
                where: { id: { in: ids } },
                data: { status: "EXPIRED" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to mark subscriptions as expired");
        }
    }
}

export default SubscriptionRepository;
