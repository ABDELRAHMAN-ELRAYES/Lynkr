import { Router } from "express";
import {
    getAllPlans,
    getPlanById,
    createPlan,
    updatePlan,
    purchaseSubscription,
    getMyActiveSubscription,
    getMySubscriptions,
    getAllSubscriptions,
    cancelSubscription,
} from "./subscription.controller";
import { protect, checkPermissions } from "../auth/auth.controller";
import { UserRole } from "../../enum/UserRole";

const SubscriptionRouter:Router = Router();

// Public: Get available plans
SubscriptionRouter.get("/plans", getAllPlans);

// Public: Get plan by ID
SubscriptionRouter.get("/plans/:id", getPlanById);

// Protected routes
SubscriptionRouter.use(protect);

// Provider: Purchase subscription
SubscriptionRouter.post("/purchase", purchaseSubscription);

// Provider: Get my active subscription
SubscriptionRouter.get("/my", getMyActiveSubscription);

// Provider: Get my subscription history
SubscriptionRouter.get("/my/history", getMySubscriptions);

// Provider: Cancel subscription
SubscriptionRouter.patch("/:id/cancel", cancelSubscription);

// ===== Admin Routes =====
// Create plan
SubscriptionRouter.post(
    "/plans",
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    createPlan
);

// Update plan
SubscriptionRouter.patch(
    "/plans/:id",
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    updatePlan
);

// Get all subscriptions
SubscriptionRouter.get(
    "/admin/all",
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    getAllSubscriptions
);

export default SubscriptionRouter;
