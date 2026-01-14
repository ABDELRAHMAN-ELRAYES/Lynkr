import ReportRepository from "./report.repository";
import NotificationService from "../notification/notification.service";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";
import {
    ICreateReportData,
    IReportQueryParams,
    ReportStatus,
    ReportActionType
} from "./types/IReport";

class ReportService {
    private static repository = ReportRepository.getInstance();

    // ===== USER: SUBMIT REPORT =====

    static async submitReport(data: ICreateReportData, next: NextFunction) {
        // Validate required fields
        if (!data.targetType || !data.targetId) {
            return next(new AppError(400, "Target type and ID are required"));
        }

        if (!data.category) {
            return next(new AppError(400, "Category is required"));
        }

        if (!data.description || data.description.trim().length < 10) {
            return next(new AppError(400, "Description must be at least 10 characters"));
        }

        // Create the report
        const report = await this.repository.createReport({
            ...data,
            description: data.description.trim()
        });

        // Notify user that report was submitted
        await NotificationService.createNotification({
            userId: data.reporterId,
            title: "Report Submitted",
            message: `Your report has been submitted and is pending review.`,
            type: "SYSTEM"
        });

        return report;
    }

    // ===== USER: GET MY REPORTS =====

    static async getMyReports(userId: string, params: IReportQueryParams = {}) {
        return await this.repository.getUserReports(userId, params);
    }

    // ===== USER: GET REPORT DETAILS =====

    static async getReportById(id: string, userId: string, isAdmin: boolean, next: NextFunction) {
        const report = await this.repository.getReportById(id);

        if (!report) {
            return next(new AppError(404, "Report not found"));
        }

        // Only reporter or admin can view report details
        if (!isAdmin && report.reporterId !== userId) {
            return next(new AppError(403, "You can only view your own reports"));
        }

        return report;
    }

    // ===== ADMIN: GET ALL REPORTS =====

    static async getAllReports(params: IReportQueryParams = {}) {
        return await this.repository.getAllReports(params);
    }

    // ===== ADMIN: UPDATE REPORT STATUS =====

    static async updateReportStatus(
        reportId: string,
        adminId: string,
        newStatus: ReportStatus,
        details: string | undefined,
        next: NextFunction
    ) {
        const report = await this.repository.getReportById(reportId);

        if (!report) {
            return next(new AppError(404, "Report not found"));
        }

        // Validate status transition
        const validTransitions: Record<ReportStatus, ReportStatus[]> = {
            SUBMITTED: ["UNDER_REVIEW"],
            UNDER_REVIEW: ["RESOLVED", "DISMISSED"],
            RESOLVED: [],
            DISMISSED: []
        };

        if (!validTransitions[report.status as ReportStatus].includes(newStatus)) {
            return next(new AppError(400, `Cannot transition from ${report.status} to ${newStatus}`));
        }

        // Update status
        await this.repository.updateReportStatus(reportId, newStatus);

        // Log the action
        await this.repository.createReportAction({
            reportId,
            adminId,
            actionType: "STATUS_CHANGE",
            details: details || `Status changed to ${newStatus}`
        });

        // Notify the reporter
        await NotificationService.createNotification({
            userId: report.reporterId,
            title: "Report Status Updated",
            message: `Your report status has been updated to: ${newStatus}`,
            type: "SYSTEM"
        });

        return await this.repository.getReportById(reportId);
    }

    // ===== ADMIN: TAKE ACTION =====

    static async takeAction(
        reportId: string,
        adminId: string,
        actionType: ReportActionType,
        details: string | undefined,
        next: NextFunction
    ) {
        const report = await this.repository.getReportById(reportId);

        if (!report) {
            return next(new AppError(404, "Report not found"));
        }

        if (!report.targetUserId) {
            return next(new AppError(400, "This report does not have a target user for actions"));
        }

        // Execute action based on type
        switch (actionType) {
            case "WARNING":
                // Send warning notification to target user
                await NotificationService.createNotification({
                    userId: report.targetUserId,
                    title: "Warning Issued",
                    message: details || "You have received a warning for policy violation.",
                    type: "SYSTEM"
                });
                break;

            case "SUSPEND":
                // Suspend the target user
                await this.repository.suspendUser(report.targetUserId);
                await NotificationService.createNotification({
                    userId: report.targetUserId,
                    title: "Account Suspended",
                    message: details || "Your account has been suspended due to policy violations.",
                    type: "SYSTEM"
                });
                break;

            case "BAN":
                // Permanently suspend (ban) the target user
                await this.repository.suspendUser(report.targetUserId);
                await NotificationService.createNotification({
                    userId: report.targetUserId,
                    title: "Account Banned",
                    message: details || "Your account has been permanently banned.",
                    type: "SYSTEM"
                });
                break;

            default:
                return next(new AppError(400, "Invalid action type"));
        }

        // Log the action
        const action = await this.repository.createReportAction({
            reportId,
            adminId,
            actionType,
            details
        });

        // Notify the reporter
        await NotificationService.createNotification({
            userId: report.reporterId,
            title: "Action Taken on Your Report",
            message: `An admin has taken action on your report.`,
            type: "SYSTEM"
        });

        return action;
    }
}

export default ReportService;
