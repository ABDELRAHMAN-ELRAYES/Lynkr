import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import PaymentService from "./payment.service";

export const createPaymentIntent = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { amount, currency } = request.body;
        const paymentIntent = await PaymentService.createPaymentIntent(amount, currency);
        response.status(200).json({ status: "success", data: { paymentIntent } });
    }
);

export const createTransaction = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const transaction = await PaymentService.createTransaction(request.body);
        response.status(201).json({ status: "success", data: { transaction } });
    }
);

export const getAllTransactions = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const transactions = await PaymentService.getAllTransactions();
        response.status(200).json({ status: "success", data: { transactions } });
    }
);

export const handleStripeWebhook = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const signature = request.headers["stripe-signature"] as string;
        const result = await PaymentService.handleWebhook(signature, request.body);
        response.status(200).json(result);
    }
);
