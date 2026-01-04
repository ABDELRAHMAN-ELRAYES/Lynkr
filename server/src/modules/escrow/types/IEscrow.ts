export type IEscrow = {
    id: string;
    projectId: string;
    amount: number;
    currency: string;
    status: string;
    releasedAmount: number;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateEscrowRequest = {
    projectId: string;
    amount: number;
    currency: string;
};

export type ReleaseFundsRequest = {
    amount: number;
    reason: string;
};

export type EscrowResponse = IEscrow;
