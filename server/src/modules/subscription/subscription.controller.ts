import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import SubscriptionService from "./subscription.service";

export const getAllPlans = catchAsync(
    async (_request: Request, response: Response, _next: NextFunction) => {
        const plans = await SubscriptionService.getAllPlans();
        response.status(200).json({ status: "success", data: { plans } });
    }
);

export const createSubscription = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const subscription = await SubscriptionService.createSubscription(request.body, next);
        response.status(201).json({ status: "success", data: { subscription } });
    }
);

export const getAllSubscriptions = catchAsync(
    async (_request: Request, response: Response, _next: NextFunction) => {
        const subscriptions = await SubscriptionService.getAllSubscriptions();
        response.status(200).json({ status: "success", data: { subscriptions } });
    }
);

export const getSubscription = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const subscription = await SubscriptionService.getSubscriptionById(request.params.id, next);
        if (!subscription) return;
        response.status(200).json({ status: "success", data: { subscription } });
    }
);

export const updateSubscription = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const subscription = await SubscriptionService.updateSubscription(request.params.id, request.body, next);
        response.status(200).json({ status: "success", data: { subscription } });
    }
);
