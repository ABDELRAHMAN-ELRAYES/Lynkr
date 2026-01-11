// Payment Types - No Prisma dependencies

export type PaymentType = "FULL" | "INITIAL" | "FINAL";
export type PaymentStatus = "PENDING" | "COMPLETED" | "REFUNDED" | "CANCELLED";

export interface IPayment {
    id: string;
    projectId: string;
    payerId: string;
    amount: number;
    currency: string;
    paymentType: PaymentType;
    status: PaymentStatus;
    stripePaymentId: string | null;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreatePaymentData {
    projectId: string;
    payerId: string;
    amount: number;
    currency?: string;
    paymentType: PaymentType;
}

export interface IUpdatePaymentData {
    status?: PaymentStatus;
    stripePaymentId?: string;
    paidAt?: Date;
}

export interface IPaymentIntent {
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
}
