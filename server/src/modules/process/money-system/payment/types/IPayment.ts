// Payment Types - No Prisma dependencies

export type PaymentType = "FULL" | "INITIAL" | "FINAL" | "SESSION" | "SUBSCRIPTION";
export type PaymentStatus = "PENDING" | "COMPLETED" | "REFUNDED" | "CANCELLED";

export interface IPayment {
    id: string;
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
    payerId: string;
    amount: number;
    currency?: string;
    paymentType: PaymentType;
}

export interface ICreateProjectPaymentData extends ICreatePaymentData {
    projectId: string;
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

export interface IProjectPayment {
    id: string;
    paymentId: string;
    projectId: string;
}
