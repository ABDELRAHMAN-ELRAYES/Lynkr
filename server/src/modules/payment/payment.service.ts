import Stripe from "stripe";
import config from "../../config/config";
import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import AppError from "../../utils/app-error";

const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: "2024-12-18.acacia",
});

class PaymentService {
    private static prisma = PrismaClientSingleton.getPrismaClient();

    static async createPaymentIntent(amount: number, currency: string = "usd") {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency,
            });
            return paymentIntent;
        } catch (error) {
            throw new AppError(500, "Failed to create payment intent");
        }
    }

    static async createTransaction(data: any) {
        try {
            return await this.prisma.transaction.create({ data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to create transaction");
        }
    }

    static async getTransactionById(id: string) {
        return await this.prisma.transaction.findUnique({ where: { id } });
    }

    static async getAllTransactions() {
        return await this.prisma.transaction.findMany();
    }

    static async handleWebhook(signature: string, body: any) {
        try {
            const event = stripe.webhooks.constructEvent(
                body,
                signature,
                config.stripe.webhookSecret
            );

            // Handle different event types
            switch (event.type) {
                case "payment_intent.succeeded":
                    // Handle successful payment
                    break;
                case "payment_intent.payment_failed":
                    // Handle failed payment
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            return { received: true };
        } catch (error) {
            throw new AppError(400, "Webhook signature verification failed");
        }
    }
}

export default PaymentService;
