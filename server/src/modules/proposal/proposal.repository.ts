import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";

class ProposalRepository {
    private prisma: PrismaClient;
    static instance: ProposalRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): ProposalRepository {
        if (!ProposalRepository.instance) {
            ProposalRepository.instance = new ProposalRepository();
        }
        return ProposalRepository.instance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    async createProposal(data: any): Promise<any> {
        try {
            return await this.prisma.proposal.create({ data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to create proposal");
        }
    }

    async getProposalsByOrderId(orderId: string): Promise<any[]> {
        try {
            return await this.prisma.proposal.findMany({
                where: { orderId },
                include: { provider: true },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get proposals");
        }
    }

    async getProposalById(id: string): Promise<any> {
        try {
            return await this.prisma.proposal.findUnique({
                where: { id },
                include: { provider: true, order: true },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get proposal");
        }
    }

    async updateProposal(id: string, data: any): Promise<any> {
        try {
            return await this.prisma.proposal.update({
                where: { id },
                data: data as any,
            });
        } catch (error) {
            throw new AppError(500, "Failed to update proposal");
        }
    }

    async deleteProposal(id: string): Promise<any> {
        try {
            return await this.prisma.proposal.delete({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to delete proposal");
        }
    }
}

export default ProposalRepository;
