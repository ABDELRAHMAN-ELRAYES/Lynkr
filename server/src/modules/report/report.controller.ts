import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import ReportService from "./report.service";
import { ReportStatus, ReportActionType } from "./types/IReport";

// ===== USER ENDPOINTS =====

// Submit a new report
export const submitReport = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const reporterId = (request.user as any).id;
        const { targetType, targetId, targetUserId, category, description } = request.body;

        const report = await ReportService.submitReport(
            { reporterId, targetType, targetId, targetUserId, category, description },
            next
        );

        if (!report) return;

        response.status(201).json({
            status: "success",
            message: "Report submitted successfully",
            data: { report }
        });
    }
);

// Get my submitted reports
export const getMyReports = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const userId = (request.user as any).id;
        const { page, limit, status, category } = request.query;

        const params = {
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 20,
            status: status as ReportStatus,
            category: category as any
        };

        const result = await ReportService.getMyReports(userId, params);

        response.status(200).json({
            status: "success",
            data: result
        });
    }
);

// Get report details (user or admin)
export const getReportById = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const userId = (request.user as any).id;
        const role = (request.user as any).role;
        const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

        const report = await ReportService.getReportById(
            request.params.id,
            userId,
            isAdmin,
            next
        );

        if (!report) return;

        response.status(200).json({
            status: "success",
            data: { report }
        });
    }
);

// ===== ADMIN ENDPOINTS =====

// Get all reports (admin only)
export const getAllReports = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const { page, limit, status, category } = request.query;

        const params = {
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 20,
            status: status as ReportStatus,
            category: category as any
        };

        const result = await ReportService.getAllReports(params);

        response.status(200).json({
            status: "success",
            data: result
        });
    }
);

// Update report status (admin only)
export const updateReportStatus = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const adminId = (request.user as any).id;
        const { status, details } = request.body;

        const report = await ReportService.updateReportStatus(
            request.params.id,
            adminId,
            status as ReportStatus,
            details,
            next
        );

        if (!report) return;

        response.status(200).json({
            status: "success",
            message: "Report status updated",
            data: { report }
        });
    }
);

// Take action on report (admin only)
export const takeAction = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const adminId = (request.user as any).id;
        const { actionType, details } = request.body;

        const action = await ReportService.takeAction(
            request.params.id,
            adminId,
            actionType as ReportActionType,
            details,
            next
        );

        if (!action) return;

        response.status(201).json({
            status: "success",
            message: "Action taken successfully",
            data: { action }
        });
    }
);
