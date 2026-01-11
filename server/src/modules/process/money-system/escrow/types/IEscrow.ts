// Escrow Types - No Prisma dependencies

export type EscrowStatus = "HOLDING" | "RELEASED" | "REFUNDED";

export interface IEscrow {
    id: string;
    projectId: string;
    depositAmount: number;
    balance: number;
    status: EscrowStatus;
    releasedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateEscrowData {
    projectId: string;
    depositAmount: number;
}

export interface IUpdateEscrowData {
    balance?: number;
    status?: EscrowStatus;
    releasedAt?: Date;
}

// Legacy types for backward compatibility
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
