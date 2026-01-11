import { IProposal } from "../../proposal/types/IProposal";
import { User } from "@prisma/client";

export type RequestStatus =
    | "DRAFT"
    | "PENDING"
    | "PUBLIC"
    | "ACCEPTED"
    | "REJECTED"
    | "EXPIRED"
    | "CANCELLED";

export type BudgetType = "Fixed" | "Hourly";

export interface IRequest {
    id: string;
    clientId: string;
    targetProviderId?: string | null;
    title: string;
    description: string;
    category: string;
    budgetType: BudgetType;
    budgetCurrency: string;
    fromBudget?: number | null;
    toBudget?: number | null;
    deadline?: Date | null;
    responseDeadline: Date;
    status: RequestStatus;
    isPublic: boolean;
    ndaRequired: boolean;
    createdAt: Date;
    updatedAt: Date;

    // Relations (optional/populated)
    client?: Partial<User>;
    targetProvider?: any; // Avoiding circular import with IProfile for now
    proposals?: IProposal[];
}

export interface ICreateRequestData {
    clientId: string;
    targetProviderId?: string; // If provided, it's a direct request
    title: string;
    description: string;
    category: string;
    budgetType: string;
    budgetCurrency?: string;
    fromBudget?: number;
    toBudget?: number;
    deadline?: string | Date;
    ndaRequired?: boolean;
    files?: Express.Multer.File[];
}

export interface IUpdateRequestData {
    title?: string;
    description?: string;
    category?: string;
    budgetType?: string;
    budgetCurrency?: string;
    fromBudget?: number;
    toBudget?: number;
    deadline?: string | Date;
    ndaRequired?: boolean;
    status?: RequestStatus;
    isPublic?: boolean;
    files?: Express.Multer.File[];
}

export interface IRequestRepositoryData {
    clientId: string;
    targetProviderId?: string;
    title: string;
    description: string;
    category: string;
    budgetType: string;
    budgetCurrency: string;
    fromBudget?: number;
    toBudget?: number;
    deadline?: Date;
    responseDeadline: Date;
    status: string;
    isPublic: boolean;
    ndaRequired: boolean;
    files?: Express.Multer.File[];
}
