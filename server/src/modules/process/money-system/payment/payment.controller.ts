import { Request, Response, NextFunction } from "express";
import PaymentService from "./payment.service";
import { PaymentType } from "./types/IPayment";

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId, amount, paymentType } = req.body;
    const clientId = (req.user as any).id;

    const result = await PaymentService.createPaymentIntent(
        projectId,
        amount,
        paymentType as PaymentType,
        clientId,
        next
    );

    if (result) {
        return res.status(200).json({
            status: "success",
            data: result
        });
    }
};

export const getProjectPayments = async (req: Request, res: Response, next: NextFunction) => {
    const payments = await PaymentService.getPaymentsByProject(req.params.projectId, next);

    if (payments) {
        return res.status(200).json({
            status: "success",
            data: payments
        });
    }
};

export const getMyPayments = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as any).id;
    const payments = await PaymentService.getMyPayments(userId, next);

    if (payments) {
        return res.status(200).json({
            status: "success",
            data: payments
        });
    }
};

export const handleStripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["stripe-signature"] as string;

    try {
        const result = await PaymentService.handleWebhook(signature, req.body);
        return res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
};
