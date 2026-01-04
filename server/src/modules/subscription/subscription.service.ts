import SubscriptionRepository from "./subscription.repository";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";

class SubscriptionService {
    private static repository = SubscriptionRepository.getInstance();

    static async getAllPlans() {
        return await this.repository.getAllPlans();
    }

    static async createSubscription(data: any, next: NextFunction) {
        return await this.repository.createSubscription(data);
    }

    static async getAllSubscriptions() {
        return await this.repository.getAllSubscriptions();
    }

    static async getSubscriptionById(id: string, next: NextFunction) {
        const subscription = await this.repository.getSubscriptionById(id);
        if (!subscription) {
            next(new AppError(404, "Subscription not found"));
            return;
        }
        return subscription;
    }

    static async updateSubscription(id: string, data: any, next: NextFunction) {
        return await this.repository.updateSubscription(id, data);
    }
}

export default SubscriptionService;
