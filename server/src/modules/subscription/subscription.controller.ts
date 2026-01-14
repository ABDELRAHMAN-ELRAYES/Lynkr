import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import SubscriptionService from "./subscription.service";

// ===== PLAN ENDPOINTS =====

// Get all available plans
export const getAllPlans = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const includeInactive = request.query.includeInactive === "true";
        const plans = await SubscriptionService.getAllPlans(includeInactive);

        response.status(200).json({
            status: "success",
            results: plans.length,
            data: { plans }
        });
    }
);

// Get plan by ID
export const getPlanById = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const plan = await SubscriptionService.getPlanById(request.params.id, next);
        if (!plan) return;

        response.status(200).json({
            status: "success",
            data: { plan }
        });
    }
);

// Create plan (admin)
export const createPlan = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const plan = await SubscriptionService.createPlan(request.body, next);
        if (!plan) return;

        response.status(201).json({
            status: "success",
            message: "Plan created successfully",
            data: { plan }
        });
    }
);

// Update plan (admin)
export const updatePlan = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const plan = await SubscriptionService.updatePlan(request.params.id, request.body, next);
        if (!plan) return;

        response.status(200).json({
            status: "success",
            message: "Plan updated successfully",
            data: { plan }
        });
    }
);

// ===== SUBSCRIPTION ENDPOINTS =====

// Purchase subscription
export const purchaseSubscription = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const userId = (request.user as any).id;
        const providerProfileId = (request.user as any).providerProfile?.id;
        const { planId } = request.body;

        if (!providerProfileId) {
            response.status(400).json({
                status: "fail",
                message: "You must have a provider profile to purchase a subscription"
            });
            return;
        }

        const subscription = await SubscriptionService.purchaseSubscription(
            providerProfileId,
            planId,
            userId,
            next
        );

        if (!subscription) return;

        response.status(201).json({
            status: "success",
            message: "Subscription activated successfully",
            data: { subscription }
        });
    }
);

// Get my active subscription
export const getMyActiveSubscription = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const providerProfileId = (request.user as any).providerProfile?.id;

        if (!providerProfileId) {
            response.status(200).json({
                status: "success",
                data: { subscription: null }
            });
            return;
        }

        const subscription = await SubscriptionService.getMyActiveSubscription(providerProfileId);

        response.status(200).json({
            status: "success",
            data: { subscription }
        });
    }
);

// Get my subscription history
export const getMySubscriptions = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const providerProfileId = (request.user as any).providerProfile?.id;

        if (!providerProfileId) {
            response.status(200).json({
                status: "success",
                data: { subscriptions: [] }
            });
            return;
        }

        const subscriptions = await SubscriptionService.getMySubscriptions(providerProfileId);

        response.status(200).json({
            status: "success",
            results: subscriptions.length,
            data: { subscriptions }
        });
    }
);

// Get all subscriptions (admin)
export const getAllSubscriptions = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const { page, limit, status } = request.query;

        const result = await SubscriptionService.getAllSubscriptions(
            page ? parseInt(page as string) : 1,
            limit ? parseInt(limit as string) : 20,
            status as string
        );

        response.status(200).json({
            status: "success",
            data: result
        });
    }
);

// Cancel subscription
export const cancelSubscription = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const userId = (request.user as any).id;

        const subscription = await SubscriptionService.cancelSubscription(
            request.params.id,
            userId,
            next
        );

        if (!subscription) return;

        response.status(200).json({
            status: "success",
            message: "Subscription cancelled",
            data: { subscription }
        });
    }
);
