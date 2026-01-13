import { Request, Response, NextFunction } from "express";
import PaymentService from "./payment.service";
import { PaymentType } from "./types/IPayment";

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        res.status(200).json({
            status: "success",
            data: result
        });
    }
};

export const getProjectPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const payments = await PaymentService.getPaymentsByProject(req.params.projectId, next);

    if (payments) {
        res.status(200).json({
            status: "success",
            data: payments
        });
    }
};

export const getMyPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req.user as any).id;
    const payments = await PaymentService.getMyPayments(userId, next);

    if (payments) {
        res.status(200).json({
            status: "success",
            data: payments
        });
    }
};

export const handleStripeWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const signature = req.headers["stripe-signature"] as string;

    try {
        const result = await PaymentService.handleWebhook(signature, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
