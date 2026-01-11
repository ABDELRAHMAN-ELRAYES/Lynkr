import RequestRepository from "./request.repository";
import { NextFunction } from "express"; // Import Express Request
import { ICreateRequestData, IUpdateRequestData, IRequestRepositoryData } from "./types/IRequest";
import AppError from "@/utils/app-error";
import { UserRole } from "@/enum/UserRole";
import { IUser } from "@/modules/user/types/IUser";

class RequestService {
    private static repository = RequestRepository.getInstance();

    /**
     * Create a new request (Direct or Public)
     */
    static async createRequest(data: ICreateRequestData, next: NextFunction) {
        try {
            const now = new Date();
            // Default: 3 days for provider to respond for direct requests
            const responseDeadline = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

            // If explicit deadline provided for project, parse it
            const projectDeadline = data.deadline ? new Date(data.deadline) : undefined;

            const isPublic = !data.targetProviderId;
            /// isPublic ? "PUBLIC" : "PENDING"; // Start as PENDING for both, logic can adjust. Actually public requests should be PUBLIC status.

            // Refined status logic
            let initialStatus = "PENDING";
            if (!data.targetProviderId) {
                initialStatus = "PUBLIC";
            }

            const repositoryData: IRequestRepositoryData = {
                clientId: data.clientId,
                targetProviderId: data.targetProviderId,
                title: data.title,
                description: data.description,
                category: data.category,
                budgetType: data.budgetType,
                budgetCurrency: data.budgetCurrency || "USD",
                fromBudget: data.fromBudget,
                toBudget: data.toBudget,
                deadline: projectDeadline,
                responseDeadline, // 3 days rule
                status: initialStatus,
                isPublic: isPublic || false,
                enableAutoPublish: data.enableAutoPublish && !isPublic || false, // Only for direct requests
                ndaRequired: data.ndaRequired || false,
                files: data.files,
            };

            const request = await this.repository.createRequest(repositoryData);

            // TODO: Handle file attachments if any
            // if (data.files && data.files.length > 0) { ... }

            // TODO: Notify provider if direct request
            // if (request.targetProviderId) { notifyProvider(...) }

            return request;
        } catch (error) {
            console.error(error);
            return next(new AppError(500, "Failed to create request"));
        }
    }

    static async getRequestById(id: string, user: IUser, next: NextFunction) {
        const request = await this.repository.getRequestById(id);
        if (!request) {
            return next(new AppError(404, "Request not found"));
        }

        // Access control: Client, Target Provider, or any Provider if Public (and approved)
        // Admin also can view
        const isClient = request.clientId === user.id;
        const isTargetProvider = request.targetProvider?.userId === user.id; // Note: targetProvider has userId relation
        const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
        const isPublicProvider = request.isPublic && (user.role === UserRole.PROVIDER_APPROVED);

        if (!isClient && !isTargetProvider && !isAdmin && !isPublicProvider) {
            return next(new AppError(403, "Not authorized to view this request"));
        }

        return request;
    }

    static async getRequestsByClientId(clientId: string, next: NextFunction) {
        return await this.repository.getRequestsByClientId(clientId);
    }

    static async getRequestsForProvider(providerId: string, serviceCategories: string[], next: NextFunction) {
        return await this.repository.getRequestsForProvider(providerId, serviceCategories);
    }

    static async updateRequest(id: string, data: IUpdateRequestData, userId: string, next: NextFunction) {
        const request = await this.repository.getRequestById(id);
        if (!request) {
            return next(new AppError(404, "Request not found"));
        }

        if (request.clientId !== userId) {
            return next(new AppError(403, "Only the client can update the request"));
        }

        if (request.status !== "PENDING" && request.status !== "DRAFT" && request.status !== "PUBLIC") {
            // Maybe restrict updates if proposals exist or accepted?
            // For Phase 1, basic restriction:
        }

        return await this.repository.updateRequest(id, data);
    }

    static async cancelRequest(id: string, userId: string, next: NextFunction) {
        const request = await this.repository.getRequestById(id);
        if (!request) {
            return next(new AppError(404, "Request not found"));
        }

        if (request.clientId !== userId) {
            return next(new AppError(403, "Only the client can cancel the request"));
        }

        if (request.status === "ACCEPTED" || request.status === "COMPLETED") {
            return next(new AppError(400, "Cannot cancel a request that is already accepted or completed"));
        }

        return await this.repository.updateRequestStatus(id, "CANCELLED");
    }

    static async publishExpiredRequests() {
        // This would be called by a cron job or scheduled task
        const expiredRequests = await this.repository.getExpiredDirectRequests();

        for (const req of expiredRequests) {
            await this.repository.updateRequestStatus(req.id, "PUBLIC", true);
            // TODO: Notify client and original provider
        }
    }
}

export default RequestService;
