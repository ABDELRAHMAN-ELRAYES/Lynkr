import PrismaClientSingleton from "../../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../../utils/app-error";
import { ICreatePaymentData, IUpdatePaymentData } from "./types/IPayment";

class PaymentRepository {
    private prisma: PrismaClient;
    static instance: PaymentRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): PaymentRepository {
        if (!PaymentRepository.instance) {
            PaymentRepository.instance = new PaymentRepository();
        }
        return PaymentRepository.instance;
    }

    async createPayment(data: ICreatePaymentData) {
        try {
            return await this.prisma.payment.create({
                data: {
                    projectId: data.projectId,
                    payerId: data.payerId,
                    amount: data.amount,
                    currency: data.currency || "USD",
                    paymentType: data.paymentType
                },
                include: {
                    project: true,
                    payer: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create payment");
        }
    }

    async getPaymentById(id: string) {
        try {
            return await this.prisma.payment.findUnique({
                where: { id },
                include: {
                    project: true,
                    payer: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get payment");
        }
    }

    async getPaymentsByProjectId(projectId: string) {
        try {
            return await this.prisma.payment.findMany({
                where: { projectId },
                orderBy: { createdAt: "desc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get project payments");
        }
    }

    async getPaymentsByPayerId(payerId: string) {
        try {
            return await this.prisma.payment.findMany({
                where: { payerId },
                include: { project: true },
                orderBy: { createdAt: "desc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get user payments");
        }
    }

    async updatePayment(id: string, data: IUpdatePaymentData) {
        try {
            return await this.prisma.payment.update({
                where: { id },
                data
            });
        } catch (error) {
            throw new AppError(500, "Failed to update payment");
        }
    }

    async getPaymentByStripeId(stripePaymentId: string) {
        try {
            return await this.prisma.payment.findFirst({
                where: { stripePaymentId },
                include: { project: true }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get payment by Stripe ID");
        }
    }
}

export default PaymentRepository;
