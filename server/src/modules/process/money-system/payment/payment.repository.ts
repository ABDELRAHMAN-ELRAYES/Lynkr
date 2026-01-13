import PrismaClientSingleton from "../../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../../utils/app-error";
import { ICreatePaymentData, ICreateProjectPaymentData, IUpdatePaymentData } from "./types/IPayment";

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

    // Create a generic payment
    async createPayment(data: ICreatePaymentData) {
        try {
            return await this.prisma.payment.create({
                data: {
                    payerId: data.payerId,
                    amount: data.amount,
                    currency: data.currency || "USD",
                    paymentType: data.paymentType
                },
                include: {
                    payer: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create payment");
        }
    }

    // Create payment linked to a project (using join table)
    async createProjectPayment(data: ICreateProjectPaymentData) {
        try {
            return await this.prisma.payment.create({
                data: {
                    payerId: data.payerId,
                    amount: data.amount,
                    currency: data.currency || "USD",
                    paymentType: data.paymentType,
                    projectPayment: {
                        create: {
                            projectId: data.projectId
                        }
                    }
                },
                include: {
                    payer: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    },
                    projectPayment: {
                        include: {
                            project: true
                        }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create project payment");
        }
    }

    async getPaymentById(id: string) {
        try {
            return await this.prisma.payment.findUnique({
                where: { id },
                include: {
                    payer: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    },
                    projectPayment: {
                        include: {
                            project: true
                        }
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
                where: {
                    projectPayment: {
                        projectId
                    }
                },
                include: {
                    projectPayment: true
                },
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
                include: {
                    projectPayment: {
                        include: {
                            project: true
                        }
                    }
                },
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
                include: {
                    projectPayment: {
                        include: {
                            project: true
                        }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get payment by Stripe ID");
        }
    }
}

export default PaymentRepository;
