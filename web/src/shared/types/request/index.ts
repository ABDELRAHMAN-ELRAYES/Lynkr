// ============================================
// Request Types - Aligned with Backend
// ============================================

export type RequestStatus =
    | "DRAFT"
    | "PENDING"
    | "PUBLIC"
    | "ACCEPTED"
    | "REJECTED"
    | "EXPIRED"
    | "CANCELLED";

export type BudgetType = "Fixed" | "Hourly";

// ============================================
// Core Entity Types
// ============================================

export interface Request {
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
    deadline?: string | null;
    responseDeadline: string;
    status: RequestStatus;
    isPublic: boolean;
    enableAutoPublish: boolean;
    ndaRequired: boolean;
    createdAt: string;
    updatedAt: string;
    // Relations (optional/populated)
    client?: RequestUser;
    targetProvider?: RequestProvider;
    proposals?: Proposal[];
    files?: RequestFile[];
}

export interface RequestUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    avatarUrl?: string;
}

export interface RequestProvider {
    id: string;
    userId: string;
    title?: string;
    user?: RequestUser;
}

export interface RequestFile {
    id: string;
    url: string;
    filename: string;
    mimetype: string;
    size: number;
}

// ============================================
// API Request/Response Types
// ============================================

export interface CreateRequestPayload {
    providerId?: string; // If provided, it's a direct request
    title: string;
    description: string;
    category: string;
    budgetType: BudgetType;
    budgetCurrency?: string;
    fromBudget?: number;
    toBudget?: number;
    deadline?: string;
    ndaChecked?: boolean;
    enableAutoPublish?: boolean;
    files?: File[];
}

export interface UpdateRequestPayload {
    title?: string;
    description?: string;
    category?: string;
    budgetType?: BudgetType;
    budgetCurrency?: string;
    fromBudget?: number;
    toBudget?: number;
    deadline?: string;
    ndaRequired?: boolean;
    files?: File[];
}

export interface RequestListResponse {
    requests: Request[];
}

export interface RequestResponse {
    request: Request;
}

// ============================================
// Proposal Types
// ============================================

export type ProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Proposal {
    id: string;
    requestId: string;
    providerProfileId: string;
    price: number;
    priceType: string; // "HOURLY" | "FIXED"
    estimatedDays: number;
    notes?: string;
    status: ProposalStatus;
    createdAt: string;
    updatedAt: string;
    // Relations
    provider?: ProposalProvider;
    request?: Request;
    files?: ProposalFile[];
}

export interface ProposalProvider {
    id: string;
    userId: string;
    title?: string;
    user?: RequestUser;
}

export interface ProposalFile {
    id: string;
    url: string;
    filename: string;
    mimetype: string;
    size: number;
}

export interface CreateProposalPayload {
    requestId: string;
    price: number;
    priceType: string; // "HOURLY" | "FIXED"
    estimatedDays: number;
    notes?: string;
    files?: File[];
}

export interface UpdateProposalPayload {
    price?: number;
    estimatedDays?: number;
    notes?: string;
    files?: File[];
}

export interface ProposalListResponse {
    proposals: Proposal[];
}

export interface ProposalResponse {
    proposal: Proposal;
}
