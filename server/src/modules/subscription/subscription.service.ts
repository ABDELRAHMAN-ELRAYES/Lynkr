import SubscriptionRepository from "./subscription.repository";
import NotificationService from "../notification/notification.service";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";
import { ICreatePlanData, IUpdatePlanData } from "./types/ISubscription";

class SubscriptionService {
    private static repository = SubscriptionRepository.getInstance();

    // ===== PLAN OPERATIONS =====

    static async getAllPlans(includeInactive: boolean = false) {
        return await this.repository.getAllPlans(!includeInactive);
    }

    static async getPlanById(id: string, next: NextFunction) {
        const plan = await this.repository.getPlanById(id);
        if (!plan) {
            return next(new AppError(404, "Plan not found"));
        }
        return plan;
    }

    static async createPlan(data: ICreatePlanData, next: NextFunction) {
        if (!data.name || !data.price || !data.durationDays) {
            return next(new AppError(400, "Name, price, and duration are required"));
        }

        if (data.price <= 0) {
            return next(new AppError(400, "Price must be greater than 0"));
        }

        if (data.durationDays <= 0) {
            return next(new AppError(400, "Duration must be at least 1 day"));
        }

        return await this.repository.createPlan(data);
    }

    static async updatePlan(id: string, data: IUpdatePlanData, next: NextFunction) {
        const plan = await this.repository.getPlanById(id);
        if (!plan) {
            return next(new AppError(404, "Plan not found"));
        }

        return await this.repository.updatePlan(id, data);
    }

    // ===== SUBSCRIPTION PURCHASE =====

    static async purchaseSubscription(
        providerProfileId: string,
        planId: string,
        userId: string,
        next: NextFunction
    ) {
        // Check if plan exists and is active
        const plan = await this.repository.getPlanById(planId);
        if (!plan) {
            return next(new AppError(404, "Plan not found"));
        }
        if (!plan.isActive) {
            return next(new AppError(400, "This plan is no longer available"));
        }

        // Check for existing active subscription
        const existingSubscription = await this.repository.getProviderActiveSubscription(providerProfileId);
        if (existingSubscription) {
            return next(new AppError(400, "You already have an active subscription. Wait for it to expire or cancel it first."));
        }

        // Create subscription with PENDING status
        const subscription = await this.repository.createSubscription({
            providerProfileId,
            planId
        });

        // TODO: Integrate with Payment module here
        // For now, simulate immediate payment success
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationDays);

        const activatedSubscription = await this.repository.updateSubscription(subscription.id, {
            status: "ACTIVE",
            paymentStatus: "PAID",
            startDate,
            endDate
        });

        // Notify provider of successful subscription
        await NotificationService.createNotification({
            userId,
            title: "Subscription Activated",
            message: `Your ${plan.name} subscription is now active until ${endDate.toLocaleDateString()}.`,
            type: "SYSTEM"
        });

        return activatedSubscription;
    }

    // ===== GET SUBSCRIPTIONS =====

    static async getMyActiveSubscription(providerProfileId: string) {
        return await this.repository.getProviderActiveSubscription(providerProfileId);
    }

    static async getMySubscriptions(providerProfileId: string) {
        return await this.repository.getProviderSubscriptions(providerProfileId);
    }

    static async getAllSubscriptions(page: number, limit: number, status?: string) {
        return await this.repository.getAllSubscriptions(page, limit, status as any);
    }

    static async getSubscriptionById(id: string, next: NextFunction) {
        const subscription = await this.repository.getSubscriptionById(id);
        if (!subscription) {
            return next(new AppError(404, "Subscription not found"));
        }
        return subscription;
    }

    // ===== CANCEL SUBSCRIPTION =====

    static async cancelSubscription(
        subscriptionId: string,
        userId: string,
        next: NextFunction
    ) {
        const subscription = await this.repository.getSubscriptionById(subscriptionId);

        if (!subscription) {
            return next(new AppError(404, "Subscription not found"));
        }

        if (subscription.status !== "ACTIVE") {
            return next(new AppError(400, "Can only cancel active subscriptions"));
        }

        const cancelled = await this.repository.updateSubscription(subscriptionId, {
            status: "CANCELLED"
        });

        // Notify provider
        await NotificationService.createNotification({
            userId,
            title: "Subscription Cancelled",
            message: "Your subscription has been cancelled.",
            type: "SYSTEM"
        });

        return cancelled;
    }

    // ===== EXPIRATION CRON JOB =====

    static async processExpiredSubscriptions() {
        const expired = await this.repository.getExpiredSubscriptions();

        if (expired.length === 0) return { processed: 0 };

        const ids = expired.map(s => s.id);
        await this.repository.markSubscriptionsExpired(ids);

        // Notify each provider
        for (const sub of expired) {
            try {
                await NotificationService.createNotification({
                    userId: sub.providerProfile.userId,
                    title: "Subscription Expired",
                    message: "Your subscription has expired. Renew to maintain priority visibility.",
                    type: "SYSTEM"
                });
            } catch (error) {
                console.error(`Failed to notify user ${sub.providerProfile.userId}:`, error);
            }
        }

        return { processed: expired.length };
    }

    static async sendExpirationWarnings() {
        const expiring = await this.repository.getExpiringSubscriptions(3);

        for (const sub of expiring) {
            try {
                const daysLeft = Math.ceil(
                    (new Date(sub.endDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );

                await NotificationService.createNotification({
                    userId: sub.providerProfile.userId,
                    title: "Subscription Expiring Soon",
                    message: `Your subscription will expire in ${daysLeft} day(s). Renew now to maintain priority visibility.`,
                    type: "SYSTEM"
                });
            } catch (error) {
                console.error(`Failed to send warning to user ${sub.providerProfile.userId}:`, error);
            }
        }

        return { warned: expiring.length };
    }
}

export default SubscriptionService;
