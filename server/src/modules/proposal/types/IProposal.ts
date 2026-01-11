export type ProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface IProposal {
    id: string;
    requestId: string;
    providerProfileId: string;
    price: number;
    priceType: string; // HOURLY, FIXED
    estimatedDays: number;
    notes?: string;
    status: ProposalStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateProposalData {
    requestId: string;
    providerProfileId: string;
    price: number;
    priceType: string;
    estimatedDays: number;
    notes?: string;
    files?: Express.Multer.File[];
}

export interface IUpdateProposalData {
    price?: number;
    estimatedDays?: number;
    notes?: string;
    files?: Express.Multer.File[];
}
