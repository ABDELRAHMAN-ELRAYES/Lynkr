import { Router } from "express";
import {
    createPaymentIntent,
    createTransaction,
    getAllTransactions,
    handleStripeWebhook,
} from "./payment.controller";
import { protect } from "../../middlewares/auth.middleware";

const PaymentRouter = Router();

PaymentRouter.post("/create-intent", protect, createPaymentIntent);
PaymentRouter.post("/transactions", protect, createTransaction);
PaymentRouter.get("/transactions", protect, getAllTransactions);
PaymentRouter.post("/webhook", handleStripeWebhook);

export default PaymentRouter;
