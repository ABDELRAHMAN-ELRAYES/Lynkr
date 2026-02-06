import RequestRepository from "./request.repository";
import { NextFunction } from "express"; // Import Express Request
import { ICreateRequestData, IUpdateRequestData, IRequestRepositoryData } from "./types/IRequest";
import AppError from "@/utils/app-error";
import { UserRole } from "@/enum/UserRole";
import { IUser } from "@/modules/user/types/IUser";
import NotificationService from "@/modules/notification/notification.service";
import ProfileRepository from "@/modules/provider/profile/profile.repository";
import ProfileService from "@/modules/provider/profile/profile.service";
import ProposalRepository from "@/modules/proposal/proposal.repository";
import ProjectService from "../project/project.service";

class RequestService {
    private static repository = RequestRepository.getInstance();
    private static profileRepo = ProfileRepository.getInstance();

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

            // Notify provider if direct request
            if (request.targetProviderId) {
                const providerProfile = await this.profileRepo.getProviderProfileById(request.targetProviderId);
                if (providerProfile) {
                    await NotificationService.sendSystemNotification(
                        providerProfile.userId,
                        "New Request Received",
                        `You have received a new service request: "${request.title}"`
                    );
                }
            }

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
        const isPublicProvider = request.isPublic && (user.role === UserRole.PROVIDER);

        if (!isClient && !isTargetProvider && !isAdmin && !isPublicProvider) {
            return next(new AppError(403, "Not authorized to view this request"));
        }

        return request;
    }

    static async getRequestsByClientId(clientId: string, _next: NextFunction) {
        return await this.repository.getRequestsByClientId(clientId);
    }

    static async getRequestsForProvider(providerId: string, serviceCategory?: string, _next?: NextFunction) {
        return await this.repository.getRequestsForProvider(providerId, serviceCategory);
    }

    static async getPublicRequests(params: {
        page: number;
        limit: number;
        category?: string;
        search?: string;
    }) {
        return await this.repository.getPublicRequests(params);
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

    static async acceptRequest(id: string, userId: string, next: NextFunction) {
        const request = await this.repository.getRequestById(id);
        if (!request) {
            return next(new AppError(404, "Request not found"));
        }

        // Check if user is the target provider
        if (!request.targetProviderId) {
            return next(new AppError(400, "This request is not directed to a specific provider"));
        }

        const profile = await ProfileService.getProviderProfileByUserId(userId, next);
        if (!profile || profile.id !== request.targetProviderId) {
            return next(new AppError(403, "Only the target provider can accept this request"));
        }

        if (request.status !== "PENDING") {
            return next(new AppError(400, `Cannot accept a request with status: ${request.status}`));
        }

        // Calculate average price from budget range
        const fromBudget = Number(request.fromBudget) || 0;
        const toBudget = Number(request.toBudget) || fromBudget;
        let averagePrice = (fromBudget + toBudget) / 2;

        if (averagePrice <= 0) {
            // Fallback if budget is not set properly, though it should be required
            averagePrice = 0;
        }

        // 1. Auto-create a proposal with the calculated average price
        // We use a fixed price type for direct acceptance
        try {
            const proposalData: any = {
                requestId: id,
                providerProfileId: profile.id,
                price: averagePrice,
                priceType: "FIXED",
                estimatedDays: 30, // Default duration, or we could ask for it in the accept modal later
                notes: "Auto-generated proposal from direct request acceptance."
            };

            // Use repo directly to avoid permissions checks in service if any
            const proposal = await ProposalRepository.getInstance().createProposal(proposalData);

            // 2. Update proposal status to ACCEPTED
            await ProposalRepository.getInstance().updateProposalStatus(proposal.id, "ACCEPTED");

            // 3. Update request status to ACCEPTED
            const updatedRequest = await this.repository.updateRequestStatus(id, "ACCEPTED");

            // 4. Create project using existing flow
            // Note: createProjectFromProposal expects (clientId, providerProfileId, proposalId, totalPrice, next)
            const project = await ProjectService.createProjectFromProposal(
                request.clientId,
                profile.id,
                proposal.id,
                averagePrice,
                next
            );

            // 5. Notify client
            await NotificationService.sendSystemNotification(
                request.clientId,
                "Request Accepted",
                `Your request "${request.title}" has been accepted by the provider. A project has been created.`
            );

            return {
                ...updatedRequest,
                project
            };

        } catch (error) {
            console.error("Error in acceptRequest flow:", error);
            // Revert request status if it was changed? 
            // Ideally use a transaction, but for now just pass error
            return next(new AppError(500, "Failed to process request acceptance"));
        }
    }

    static async rejectRequest(id: string, userId: string, next: NextFunction) {
        const request = await this.repository.getRequestById(id);
        if (!request) {
            return next(new AppError(404, "Request not found"));
        }

        // Check if user is the target provider
        if (!request.targetProviderId) {
            return next(new AppError(400, "This request is not directed to a specific provider"));
        }

        const profile = await ProfileService.getProviderProfileByUserId(userId, next);
        if (!profile || profile.id !== request.targetProviderId) {
            return next(new AppError(403, "Only the target provider can reject this request"));
        }

        if (request.status !== "PENDING") {
            return next(new AppError(400, `Cannot reject a request with status: ${request.status}`));
        }

        const updatedRequest = await this.repository.updateRequestStatus(id, "REJECTED");

        // Notify client
        await NotificationService.sendSystemNotification(
            request.clientId,
            "Request Rejected",
            `Your request "${request.title}" has been rejected by the provider.`
        );

        return updatedRequest;
    }

    static async publishExpiredRequests() {
        // This would be called by a cron job or scheduled task
        const expiredRequests = await this.repository.getExpiredDirectRequests();

        for (const req of expiredRequests) {
            await this.repository.updateRequestStatus(req.id, "PUBLIC", true);

            // Notify client that request is now public
            await NotificationService.sendSystemNotification(
                req.clientId,
                "Request Published Publicly",
                `Your request "${req.title}" has been published publicly as the deadline passed.`
            );

            // Notify original provider that request expired
            if (req.targetProviderId) {
                const providerProfile = await this.profileRepo.getProviderProfileById(req.targetProviderId);
                if (providerProfile) {
                    await NotificationService.sendSystemNotification(
                        providerProfile.userId,
                        "Request Deadline Expired",
                        `The request "${req.title}" has expired and is now open to other providers.`
                    );
                }
            }
        }
    }
}

export default RequestService;
