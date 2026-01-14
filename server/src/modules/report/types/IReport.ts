// Report Types for Module 10: Reporting & Moderation

// Report categories
export type ReportCategory =
    | "FRAUD"
    | "ABUSE"
    | "SERVICE_FAILURE"
    | "POLICY_VIOLATION"
    | "TECHNICAL";

// Report status
export type ReportStatus =
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "RESOLVED"
    | "DISMISSED";

// Target types
export type ReportTargetType =
    | "USER"
    | "PROJECT"
    | "SESSION"
    | "REQUEST";

// Admin action types
export type ReportActionType =
    | "STATUS_CHANGE"
    | "WARNING"
    | "SUSPEND"
    | "BAN";

// Base report interface
export interface IReport {
    id: string;
    reporterId: string;
    targetUserId?: string | null;
    targetType: ReportTargetType;
    targetId: string;
    category: ReportCategory;
    description: string;
    status: ReportStatus;
    createdAt: Date;
    updatedAt: Date;
}

// Report with relations
export interface IReportWithDetails extends IReport {
    reporter?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    targetUser?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    files?: IReportFile[];
    actions?: IReportAction[];
}

// Report file
export interface IReportFile {
    id: string;
    reportId: string;
    fileId: string;
    file?: {
        id: string;
        filename: string;
        path: string;
        mimetype: string;
    };
}

// Report action
export interface IReportAction {
    id: string;
    reportId: string;
    adminId: string;
    actionType: ReportActionType;
    details?: string | null;
    createdAt: Date;
    admin?: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

// Input for creating a report
export interface ICreateReportData {
    reporterId: string;
    targetType: ReportTargetType;
    targetId: string;
    targetUserId?: string;
    category: ReportCategory;
    description: string;
}

// Input for admin action
export interface ICreateReportActionData {
    reportId: string;
    adminId: string;
    actionType: ReportActionType;
    details?: string;
    newStatus?: ReportStatus;
}

// Query params for reports
export interface IReportQueryParams {
    page?: number;
    limit?: number;
    status?: ReportStatus;
    category?: ReportCategory;
}
