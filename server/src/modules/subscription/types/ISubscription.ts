// Subscription Types for Module 11: Subscription Plans

// Subscription status
export type SubscriptionStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";

// Payment status
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

// Subscription plan interface
export interface ISubscriptionPlan {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    durationDays: number;
    visibilityBoost: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Provider subscription interface
export interface IProviderSubscription {
    id: string;
    providerProfileId: string;
    planId: string;
    status: SubscriptionStatus;
    paymentStatus: PaymentStatus;
    startDate?: Date | null;
    endDate?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    plan?: ISubscriptionPlan;
}

// Input for creating a plan (admin)
export interface ICreatePlanData {
    name: string;
    description?: string;
    price: number;
    durationDays: number;
    visibilityBoost?: number;
}

// Input for updating a plan (admin)
export interface IUpdatePlanData {
    name?: string;
    description?: string;
    price?: number;
    durationDays?: number;
    visibilityBoost?: number;
    isActive?: boolean;
}

// Input for purchasing a subscription
export interface IPurchaseSubscriptionData {
    providerProfileId: string;
    planId: string;
}

// Query params
export interface ISubscriptionQueryParams {
    page?: number;
    limit?: number;
    status?: SubscriptionStatus;
}
