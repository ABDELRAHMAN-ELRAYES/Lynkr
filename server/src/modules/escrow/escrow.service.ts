import EscrowRepository from "./escrow.repository";
import Stripe from "stripe";
import config from "../../config/config";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";

const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: "2024-12-18.acacia",
});

class EscrowService {
    private static repository = EscrowRepository.getInstance();

    static async createEscrow(data: any, next: NextFunction) {
        // Create Stripe payment intent for escrow
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(data.amount * 100),
            currency: data.currency || "usd",
            capture_method: "manual", // Hold funds without capturing
        });

        const escrow = await this.repository.createEscrow({
            ...data,
            status: "PENDING",
            releasedAmount: 0,
            stripePaymentIntentId: paymentIntent.id,
        });

        return { escrow, clientSecret: paymentIntent.client_secret };
    }

    static async getEscrowByProjectId(projectId: string, next: NextFunction) {
        const escrow = await this.repository.getEscrowByProjectId(projectId);
        if (!escrow) {
            next(new AppError(404, "Escrow not found"));
            return;
        }
        return escrow;
    }

    static async releaseFunds(escrowId: string, amount: number, next: NextFunction) {
        const escrow = await this.repository.getPrismaClient().escrow.findUnique({
            where: { id: escrowId },
        });

        if (!escrow) {
            next(new AppError(404, "Escrow not found"));
            return;
        }

        if (escrow.status !== "ACTIVE") {
            next(new AppError(400, "Escrow is not active"));
            return;
        }

        const newReleasedAmount = escrow.releasedAmount + amount;
        if (newReleasedAmount > escrow.amount) {
            next(new AppError(400, "Release amount exceeds escrow balance"));
            return;
        }

        // Capture funds from Stripe
        await stripe.paymentIntents.capture(escrow.stripePaymentIntentId, {
            amount_to_capture: Math.round(amount * 100),
        });

        const updatedEscrow = await this.repository.updateEscrow(escrowId, {
            releasedAmount: newReleasedAmount,
            status: newReleasedAmount >= escrow.amount ? "COMPLETED" : "ACTIVE",
        });

        return updatedEscrow;
    }

    static async cancelEscrow(escrowId: string, next: NextFunction) {
        const escrow = await this.repository.getPrismaClient().escrow.findUnique({
            where: { id: escrowId },
        });

        if (!escrow) {
            next(new AppError(404, "Escrow not found"));
            return;
        }

        // Cancel Stripe payment intent
        await stripe.paymentIntents.cancel(escrow.stripePaymentIntentId);

        return await this.repository.updateEscrow(escrowId, {
            status: "CANCELLED",
        });
    }
}

export default EscrowService;
