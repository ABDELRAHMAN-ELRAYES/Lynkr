import ProposalRepository from "./proposal.repository";
import RequestRepository from "../process/request/request.repository";
import ProfileRepository from "../provider/profile/profile.repository";
import ProjectService from "../process/project/project.service";
import NotificationService from "../notification/notification.service";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";
import SocketService from "../../services/socket.service";
import { ICreateProposalData, IUpdateProposalData } from "./types/IProposal";

class ProposalService {
    private static repository = ProposalRepository.getInstance();
    private static requestRepository = RequestRepository.getInstance();
    private static profileRepository = ProfileRepository.getInstance();
    private static socketService = SocketService.getInstance();

    static async createProposal(userId: string, data: ICreateProposalData, next: NextFunction) {
        // 1. Verify provider profile exists for user
        const profile = await this.profileRepository.getProviderProfileByUserId(userId);
        if (!profile) {
            return next(new AppError(403, "You must be a provider to submit a proposal"));
        }

        // 2. Verify request exists and is open
        const request = await this.requestRepository.getRequestById(data.requestId);
        if (!request) {
            return next(new AppError(404, "Request not found"));
        }

        if (request.status !== "PENDING" && request.status !== "PUBLIC") {
            return next(new AppError(400, "This request is no longer accepting proposals"));
        }

        // 3. Create proposal
        // Note: Repository handles unique constraint (one proposal per provider per request)
        data.providerProfileId = profile.id;

        const proposal = await this.repository.createProposal(data);

        // 4. Notify client
        if (request.client) { // client relation populated in getRequestById
            this.socketService.sendToUser(request.clientId, "proposal:new", {
                proposalId: proposal.id,
                requestId: data.requestId,
                providerName: `${profile.user?.firstName} ${profile.user?.lastName}`
            });
        }

        // Create persistent Notification record
        await NotificationService.sendProposalNotification(
            request.clientId,
            "New Proposal Received",
            `${profile.user?.firstName} ${profile.user?.lastName} submitted a proposal for your request.`,
            proposal.id
        );

        return proposal;
    }

    static async getProposalsByRequestId(requestId: string, userId: string, next: NextFunction) {
        const request = await this.requestRepository.getRequestById(requestId);
        if (!request) {
            return next(new AppError(404, "Request not found"));
        }

        // Access control: Client or providing provider?
        // For now, allow client to see all.
        // Provider should only see their own? Or all if public bidding?
        // Spec says "Client Review: Display all received proposals".
        // Provider view: "List of received requests, Proposal status".

        if (request.clientId !== userId) {
            // If not client, maybe restrict? 
            // For now letting providers view proposals might be okay or restricted.
            // We'll restrict to client only for "view all" endpoint usually.
            // But let's check role.
            return next(new AppError(403, "Only the client can view all proposals"));
        }

        return await this.repository.getProposalsByRequestId(requestId);
    }

    static async getProposalById(id: string, userId: string, next: NextFunction) {
        const proposal = await this.repository.getProposalById(id);
        if (!proposal) {
            return next(new AppError(404, "Proposal not found"));
        }

        // Access: Client (of request) or Provider (owner of proposal)
        if (proposal.request.clientId !== userId && proposal.providerProfile.userId !== userId) {
            return next(new AppError(403, "Not authorized to view this proposal"));
        }

        return proposal;
    }

    static async acceptProposal(id: string, userId: string, next: NextFunction) {
        const proposal = await this.repository.getProposalById(id);
        if (!proposal) {
            return next(new AppError(404, "Proposal not found"));
        }

        if (proposal.request.clientId !== userId) {
            return next(new AppError(403, "Only the client can accept a proposal"));
        }

        if (proposal.request.status !== "PENDING" && proposal.request.status !== "PUBLIC") {
            return next(new AppError(400, "Request is already closed"));
        }

        // 1. Update proposal status to ACCEPTED
        const acceptedProposal = await this.repository.updateProposalStatus(id, "ACCEPTED");

        // 2. Reject all other proposals for this request
        await this.repository.rejectOtherProposals(proposal.requestId, id);

        // 3. Update Request status to ACCEPTED
        await this.requestRepository.updateRequestStatus(proposal.requestId, "ACCEPTED");

        // 4. Create Project and Escrow
        const project = await ProjectService.createProjectFromProposal(
            proposal.request.clientId,
            proposal.providerProfileId,
            id,
            Number(proposal.price),
            next
        );

        // 5. Notify provider (real-time)
        this.socketService.sendToUser(proposal.providerProfile.userId, "proposal:accepted", {
            proposalId: id,
            requestId: proposal.requestId,
            projectId: project?.id,
        });

        // Persistent notification
        await NotificationService.sendProposalNotification(
            proposal.providerProfile.userId,
            "Proposal Accepted!",
            `Your proposal for "${proposal.request.title}" has been accepted. A project has been created.`,
            id
        );

        return acceptedProposal;
    }

    static async rejectProposal(id: string, userId: string, next: NextFunction) {
        const proposal = await this.repository.getProposalById(id);
        if (!proposal) {
            return next(new AppError(404, "Proposal not found"));
        }

        if (proposal.request.clientId !== userId) {
            return next(new AppError(403, "Only the client can reject a proposal"));
        }

        const rejectedProposal = await this.repository.updateProposalStatus(id, "REJECTED");

        // Notify provider (real-time)
        this.socketService.sendToUser(proposal.providerProfile.userId, "proposal:rejected", {
            proposalId: id,
            requestId: proposal.requestId,
        });

        // Persistent notification
        await NotificationService.sendProposalNotification(
            proposal.providerProfile.userId,
            "Proposal Not Selected",
            `Your proposal for "${proposal.request.title}" was not selected.`,
            id
        );

        return rejectedProposal;
    }

    static async updateProposal(id: string, data: IUpdateProposalData, userId: string, next: NextFunction) {
        const proposal = await this.repository.getProposalById(id);
        if (!proposal) {
            return next(new AppError(404, "Proposal not found"));
        }

        if (proposal.providerProfile.userId !== userId) {
            return next(new AppError(403, "Only the provider can update their proposal"));
        }

        if (proposal.status !== "PENDING") {
            return next(new AppError(400, "Cannot edit a proposal that is not pending"));
        }

        return await this.repository.updateProposal(id, data);
    }

    static async deleteProposal(id: string, userId: string, next: NextFunction) {
        const proposal = await this.repository.getProposalById(id);
        if (!proposal) {
            return next(new AppError(404, "Proposal not found"));
        }

        if (proposal.providerProfile.userId !== userId) {
            return next(new AppError(403, "Only the provider can delete their proposal"));
        }

        return await this.repository.deleteProposal(id);
    }
}

export default ProposalService;
