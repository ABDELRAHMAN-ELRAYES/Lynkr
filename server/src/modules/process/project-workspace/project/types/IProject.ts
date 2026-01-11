// Project Types - No Prisma dependencies

export type ProjectStatus = "PENDING_PAYMENT" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface IProject {
    id: string;
    clientId: string;
    providerProfileId: string;
    acceptedProposalId: string;
    status: ProjectStatus;
    totalPrice: number;
    paidAmount: number;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateProjectData {
    clientId: string;
    providerProfileId: string;
    acceptedProposalId: string;
    totalPrice: number;
}

export interface IUpdateProjectData {
    status?: ProjectStatus;
    paidAmount?: number;
    startedAt?: Date;
    completedAt?: Date;
}

export interface IProjectWithDetails extends IProject {
    client?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    providerProfile?: {
        id: string;
        title: string | null;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
    };
    acceptedProposal?: {
        id: string;
        price: number;
        estimatedDays: number;
    };
    escrow?: {
        id: string;
        balance: number;
        status: string;
    };
}
