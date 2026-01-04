import { Router } from "express";
import {
    getAllPlans,
    createSubscription,
    getAllSubscriptions,
    getSubscription,
    updateSubscription,
} from "./subscription.controller";
import { protect } from "../../middlewares/auth.middleware";

const SubscriptionRouter = Router();

SubscriptionRouter.get("/plans", getAllPlans);

SubscriptionRouter.route("/")
    .post(protect, createSubscription)
    .get(protect, getAllSubscriptions);

SubscriptionRouter.route("/:id")
    .get(protect, getSubscription)
    .put(protect, updateSubscription);

export default SubscriptionRouter;
