export type ISubscription = {
    id: string;
    userId: string;
    planId: string;
    status: string;
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
};

export type IPlan = {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    features?: string[];
};

export type CreateSubscriptionRequest = {
    userId: string;
    planId: string;
};

export type SubscriptionResponse = ISubscription;
