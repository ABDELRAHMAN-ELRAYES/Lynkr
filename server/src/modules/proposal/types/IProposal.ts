export type IProposal = {
    id: string;
    orderId: string;
    providerId: string;
    description: string;
    price: number;
    timeline: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateProposalRequest = {
    orderId: string;
    providerId: string;
    description: string;
    price: number;
    timeline: number;
};

export type ProposalResponse = IProposal;
