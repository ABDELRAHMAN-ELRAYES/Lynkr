import { Router, raw } from "express";
import {
    createPaymentIntent,
    getProjectPayments,
    getMyPayments,
    handleStripeWebhook
} from "./payment.controller";
import { protect } from "../../../auth/auth.controller";

const PaymentRouter = Router();

// Stripe webhook (must use raw body parser)
PaymentRouter.post("/webhook", raw({ type: "application/json" }), handleStripeWebhook);

// Protected routes
PaymentRouter.use(protect);

// Create payment intent for a project
PaymentRouter.post("/intent", createPaymentIntent);

// Get payments for a specific project
PaymentRouter.get("/project/:projectId", getProjectPayments);

// Get current user's payment history
PaymentRouter.get("/me", getMyPayments);

export default PaymentRouter;
