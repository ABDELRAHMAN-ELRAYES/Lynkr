import { Router } from "express";
import {
    createPaymentIntent,
    createTransaction,
    getAllTransactions,
    handleStripeWebhook,
} from "./payment.controller";
import { protect } from "../auth/auth.controller";

const PaymentRouter = Router();

PaymentRouter.post("/create-intent", protect, createPaymentIntent);
PaymentRouter.post("/transactions", protect, createTransaction);
PaymentRouter.get("/transactions", protect, getAllTransactions);
PaymentRouter.post("/webhook", handleStripeWebhook);

export default PaymentRouter;
