export type IOperation = {
    id: string;
    clientId: string;
    providerId?: string;
    title: string;
    description: string;
    budget: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateOperationRequest = {
    clientId: string;
    providerId?: string;
    title: string;
    description: string;
    budget: number;
};

export type OperationResponse = IOperation;
