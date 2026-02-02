import ProviderApplicationRepository from "./provider-application.repository";
import ProfileRepository from "../profile/profile.repository";
import { NextFunction } from "express";
import AppError from "../../../utils/app-error";
import UserService from "../../user/user.service";
import { UserRole } from "../../../enum/UserRole";

const COOLDOWN_DAYS = 3;

class ProviderApplicationService {
    private static repository = ProviderApplicationRepository.getInstance();
    private static profileRepository = ProfileRepository.getInstance();

    /**
     * Submit a new provider application
     */
    static async submitApplication(userId: string, next: NextFunction) {
        // 1. Check if user has pending application
        const hasPending = await this.repository.hasPendingApplication(userId);
        if (hasPending) {
            return next(new AppError(400, "You already have a pending application"));
        }

        // 2. Check cooldown from last rejection
        const lastRejected = await this.repository.getLatestRejectedApplication(userId);
        if (lastRejected && lastRejected.cooldownEndsAt) {
            if (new Date() < lastRejected.cooldownEndsAt) {
                const daysLeft = Math.ceil(
                    (lastRejected.cooldownEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
                return next(new AppError(400, `You cannot reapply for ${daysLeft} more days`));
            }
        }

        // 3. Get provider profile
        const profile = await this.profileRepository.getProviderProfileByUserId(userId);
        if (!profile) {
            return next(new AppError(400, "Please complete your provider profile first"));
        }

        // 4. Create application
        const application = await this.repository.createApplication({
            userId,
            providerProfileId: profile.id,
        });

        // 5. Update user role to PENDING_PROVIDER
        await UserService.updateUserRole(userId, UserRole.PENDING_PROVIDER);

        return application;
    }

    /**
     * Get current user's application history
     */
    static async getMyApplications(userId: string, _next: NextFunction) {
        return await this.repository.getApplicationsByUserId(userId);
    }

    /**
     * Get all pending applications (Admin)
     */
    static async getPendingApplications(_next: NextFunction) {
        return await this.repository.getPendingApplications();
    }

    /**
     * Approve application (Admin)
     */
    static async approveApplication(applicationId: string, adminId: string, next: NextFunction) {
        const application = await this.repository.getApplicationById(applicationId);
        if (!application) {
            return next(new AppError(404, "Application not found"));
        }

        if (application.status !== "PENDING") {
            return next(new AppError(400, "Application is not pending"));
        }

        // 1. Update application status
        await this.repository.updateApplicationStatus(applicationId, "APPROVED");

        // 2. Create review record
        await this.repository.createReview(applicationId, {
            adminId,
            decision: "APPROVED",
        });

        // 3. Update provider profile to approved
        if (application.providerProfileId) {
            await this.profileRepository.approveProfile(application.providerProfileId);
        }

        // 4. Update user role
        if (application.userId) {
            await UserService.updateUserRole(application.userId, UserRole.PROVIDER);
        }

        return { message: "Application approved successfully" };
    }

    /**
     * Reject application (Admin)
     */
    static async rejectApplication(
        applicationId: string,
        adminId: string,
        reason: string,
        next: NextFunction
    ) {
        if (!reason || reason.trim().length === 0) {
            return next(new AppError(400, "Rejection reason is required"));
        }

        const application = await this.repository.getApplicationById(applicationId);
        if (!application) {
            return next(new AppError(404, "Application not found"));
        }

        if (application.status !== "PENDING") {
            return next(new AppError(400, "Application is not pending"));
        }

        // Calculate cooldown end date
        const cooldownEndsAt = new Date();
        cooldownEndsAt.setDate(cooldownEndsAt.getDate() + COOLDOWN_DAYS);

        // 1. Update application status
        await this.repository.updateApplicationStatus(applicationId, "REJECTED", cooldownEndsAt);

        // 2. Create review record
        await this.repository.createReview(applicationId, {
            adminId,
            decision: "REJECTED",
            reason,
        });

        // 3. Revert user role back to CLIENT
        if (application.userId) {
            await UserService.updateUserRole(application.userId, UserRole.CLIENT);
        }

        return { message: "Application rejected" };
    }

    /**
     * Get single application by ID (Admin)
     */
    static async getApplicationById(applicationId: string, next: NextFunction) {
        const application = await this.repository.getApplicationById(applicationId);
        if (!application) {
            return next(new AppError(404, "Application not found"));
        }
        return application;
    }
}

export default ProviderApplicationService;
