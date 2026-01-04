import ProposalRepository from "./proposal.repository";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";
import SocketService from "../../services/socket.service";

class ProposalService {
    private static repository = ProposalRepository.getInstance();
    private static socketService = SocketService.getInstance();

    static async createProposal(data: any, next: NextFunction) {
        const proposal = await this.repository.createProposal(data);

        // Notify order owner about new proposal
        const order = await this.repository.getPrismaClient().operation.findUnique({
            where: { id: data.orderId },
        });

        if (order) {
            this.socketService.sendToUser(order.clientId, "proposal:new", {
                proposalId: proposal.id,
                orderId: data.orderId,
            });
        }

        return proposal;
    }

    static async getProposalsByOrderId(orderId: string) {
        return await this.repository.getProposalsByOrderId(orderId);
    }

    static async getProposalById(id: string, next: NextFunction) {
        const proposal = await this.repository.getProposalById(id);
        if (!proposal) {
            next(new AppError(404, "Proposal not found"));
            return;
        }
        return proposal;
    }

    static async acceptProposal(id: string, next: NextFunction) {
        const proposal = await this.repository.updateProposal(id, {
            status: "ACCEPTED",
        });

        // Notify provider
        this.socketService.sendToUser(proposal.providerId, "proposal:accepted", {
            proposalId: id,
        });

        return proposal;
    }

    static async rejectProposal(id: string, next: NextFunction) {
        const proposal = await this.repository.updateProposal(id, {
            status: "REJECTED",
        });

        // Notify provider
        this.socketService.sendToUser(proposal.providerId, "proposal:rejected", {
            proposalId: id,
        });

        return proposal;
    }

    static async updateProposal(id: string, data: any, next: NextFunction) {
        return await this.repository.updateProposal(id, data);
    }

    static async deleteProposal(id: string, next: NextFunction) {
        return await this.repository.deleteProposal(id);
    }
}

export default ProposalService;
