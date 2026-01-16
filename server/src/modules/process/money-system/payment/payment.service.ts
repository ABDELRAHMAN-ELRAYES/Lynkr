import Stripe from "stripe";
import { NextFunction } from "express";
import config from "../../../../config/config";
import AppError from "../../../../utils/app-error";
import PaymentRepository from "./payment.repository";
import ProjectRepository from "./../../project/project.repository";
import EscrowRepository from "../escrow/escrow.repository";
import ProfileRepository from "./../../../provider/profile/profile.repository";
import NotificationService from "./../../../notification/notification.service";
import SubscriptionRepository from "./../../../subscription/subscription.repository";
import { PaymentType } from "./types/IPayment";

const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: "2025-02-24.acacia",
});


class PaymentService {
    private static paymentRepo = PaymentRepository.getInstance();
    private static projectRepo = ProjectRepository.getInstance();
    private static escrowRepo = EscrowRepository.getInstance();
    private static profileRepo = ProfileRepository.getInstance();

    static async createPaymentIntent(
        projectId: string,
        amount: number,
        paymentType: PaymentType,
        clientId: string,
        next: NextFunction
    ) {
        try {
            // Verify project exists and client owns it
            const project = await this.projectRepo.getProjectById(projectId);
            if (!project) {
                return next(new AppError(404, "Project not found"));
            }
            if (project.clientId !== clientId) {
                return next(new AppError(403, "Not authorized to pay for this project"));
            }

            // Create Stripe payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: "usd",
                metadata: {
                    projectId,
                    paymentType
                }
            });

            // Create payment record with project link
            const payment = await this.paymentRepo.createProjectPayment({
                projectId,
                payerId: clientId,
                amount,
                paymentType
            });

            // Update payment with Stripe ID
            await this.paymentRepo.updatePayment(payment.id, {
                stripePaymentId: paymentIntent.id
            });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                paymentId: payment.id,
                amount,
                currency: "USD"
            };
        } catch (error) {
            return next(new AppError(500, "Failed to create payment intent"));
        }
    }

    static async getPaymentsByProject(projectId: string, next: NextFunction) {
        try {
            return await this.paymentRepo.getPaymentsByProjectId(projectId);
        } catch (error) {
            return next(new AppError(500, "Failed to get payments"));
        }
    }

    static async getMyPayments(userId: string, next: NextFunction) {
        try {
            return await this.paymentRepo.getPaymentsByPayerId(userId);
        } catch (error) {
            return next(new AppError(500, "Failed to get payments"));
        }
    }

    static async handleWebhook(signature: string, body: Buffer) {
        try {
            const event = stripe.webhooks.constructEvent(
                body,
                signature,
                config.stripe.webhookSecret
            );

            switch (event.type) {
                case "payment_intent.succeeded":
                    await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
                    break;
                case "payment_intent.payment_failed":
                    await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            return { received: true };
        } catch (error) {
            throw new AppError(400, "Webhook signature verification failed");
        }
    }

    private static async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
        const payment = await this.paymentRepo.getPaymentByStripeId(paymentIntent.id);
        if (!payment) return;

        // Update payment status
        await this.paymentRepo.updatePayment(payment.id, {
            status: "COMPLETED",
            paidAt: new Date()
        });

        // Handle subscription payments
        if (payment.paymentType === "SUBSCRIPTION") {
            await this.handleSubscriptionPaymentSuccess(payment, paymentIntent);
            return;
        }

        // Handle project payments - Get projectId from the join table
        const projectId = payment.projectPayment?.projectId;
        if (!projectId) return;

        // Add funds to escrow
        const escrow = await this.escrowRepo.getEscrowByProjectId(projectId);
        if (escrow) {
            const amountInDecimal = Number(payment.amount);
            await this.escrowRepo.addToEscrow(escrow.id, amountInDecimal);
        }

        // Update project paid amount and status
        const project = await this.projectRepo.getProjectById(projectId);
        if (project) {
            const newPaidAmount = Number(project.paidAmount) + Number(payment.amount);
            const totalPrice = Number(project.totalPrice);

            const updateData: any = {
                paidAmount: newPaidAmount
            };

            // If fully paid, start project
            if (newPaidAmount >= totalPrice && project.status === "PENDING_PAYMENT") {
                updateData.status = "IN_PROGRESS";
                updateData.startedAt = new Date();
            }

            await this.projectRepo.updateProject(project.id, updateData);

            // Notify client
            await NotificationService.sendPaymentNotification(
                project.clientId,
                "Payment Received",
                `Your payment of $${Number(payment.amount).toFixed(2)} has been processed successfully.`,
                payment.id
            );

            // Notify provider
            const providerProfile = await this.profileRepo.getProviderProfileById(project.providerProfileId);
            if (providerProfile) {
                await NotificationService.sendPaymentNotification(
                    providerProfile.userId,
                    "Payment Received for Project",
                    `Client has made a payment of $${Number(payment.amount).toFixed(2)} for your project.`,
                    payment.id
                );
            }
        }

        console.log(`[Payment] Completed: ${payment.id} for project ${projectId}`);
    }

    private static async handleSubscriptionPaymentSuccess(payment: any, paymentIntent: Stripe.PaymentIntent) {
        try {
            // Get subscriptionId from payment intent metadata
            const subscriptionId = paymentIntent.metadata?.subscriptionId;
            if (!subscriptionId) {
                console.log(`[Payment] Subscription payment ${payment.id} missing subscriptionId in metadata`);
                return;
            }

            const subscriptionRepo = SubscriptionRepository.getInstance();
            const subscription = await subscriptionRepo.getSubscriptionById(subscriptionId);

            if (!subscription) {
                console.log(`[Payment] Subscription ${subscriptionId} not found`);
                return;
            }

            if (subscription.status !== "PENDING") {
                console.log(`[Payment] Subscription ${subscriptionId} is not pending, current status: ${subscription.status}`);
                return;
            }

            // Activate the subscription
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + subscription.plan.durationDays);

            await subscriptionRepo.updateSubscription(subscriptionId, {
                status: "ACTIVE",
                paymentStatus: "PAID",
                startDate,
                endDate
            });

            // Notify provider of successful subscription
            await NotificationService.createNotification({
                userId: subscription.providerProfile.userId,
                title: "Subscription Activated",
                message: `Your ${subscription.plan.name} subscription is now active until ${endDate.toLocaleDateString()}.`,
                type: "SYSTEM"
            });

            console.log(`[Payment] Subscription ${subscriptionId} activated for provider ${subscription.providerProfile.userId}`);
        } catch (error) {
            console.error(`[Payment] Failed to process subscription payment:`, error);
        }
    }

    private static async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
        const payment = await this.paymentRepo.getPaymentByStripeId(paymentIntent.id);
        if (!payment) return;

        await this.paymentRepo.updatePayment(payment.id, {
            status: "CANCELLED"
        });

        // Notify payer about failure
        await NotificationService.sendPaymentNotification(
            payment.payerId,
            "Payment Failed",
            "Your payment could not be processed. Please try again or use a different payment method.",
            payment.id
        );

        console.log(`[Payment] Failed: ${payment.id}`);
    }
}

export default PaymentService;

