export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ReviewDecision = "APPROVED" | "REJECTED";

export interface IProviderApplication {
    id: string;
    userId: string;
    providerProfileId?: string | null;
    status: ApplicationStatus;
    cooldownEndsAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IApplicationReview {
    id: string;
    applicationId: string;
    adminId: string;
    decision: ReviewDecision;
    reason?: string | null;
    reviewedAt: Date;
}

export interface ICreateApplicationData {
    userId: string;
    providerProfileId?: string;
}

export interface IReviewApplicationData {
    adminId: string;
    decision: ReviewDecision;
    reason?: string;
}
