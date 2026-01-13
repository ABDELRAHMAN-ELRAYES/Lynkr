import { NextFunction, Request, Response } from "express";
import ProviderApplicationService from "./provider-application.service";

/**
 * Submit a new provider application
 */
export const submitApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req.user as any).id;
    const application = await ProviderApplicationService.submitApplication(userId, next);

    if (application) {
        res.status(201).json({
            status: "success",
            message: "Application submitted successfully",
            data: application,
        });
    }
};

/**
 * Get current user's application history
 */
export const getMyApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req.user as any).id;
    const applications = await ProviderApplicationService.getMyApplications(userId, next);

    if (applications) {
        res.status(200).json({
            status: "success",
            data: applications,
        });
    }
};

/**
 * Get all pending applications (Admin only)
 */
export const getPendingApplications = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const applications = await ProviderApplicationService.getPendingApplications(next);

    if (applications) {
        res.status(200).json({
            status: "success",
            data: applications,
        });
    }
};

/**
 * Get single application by ID (Admin only)
 */
export const getApplicationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const application = await ProviderApplicationService.getApplicationById(req.params.id, next);

    if (application) {
        res.status(200).json({
            status: "success",
            data: application,
        });
    }
};

/**
 * Approve application (Admin only)
 */
export const approveApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const adminId = (req.user as any).id;
    const result = await ProviderApplicationService.approveApplication(req.params.id, adminId, next);

    if (result) {
        res.status(200).json({
            status: "success",
            message: result.message,
        });
    }
};

/**
 * Reject application (Admin only)
 */
export const rejectApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const adminId = (req.user as any).id;
    const { reason } = req.body;

    const result = await ProviderApplicationService.rejectApplication(
        req.params.id,
        adminId,
        reason,
        next
    );

    if (result) {
        res.status(200).json({
            status: "success",
            message: result.message,
        });
    }
};
