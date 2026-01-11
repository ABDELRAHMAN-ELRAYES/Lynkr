import PrismaClientSingleton from "../../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../../utils/app-error";
import { ICreateEscrowData, IUpdateEscrowData } from "./types/IEscrow";

class EscrowRepository {
    private prisma: PrismaClient;
    static instance: EscrowRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): EscrowRepository {
        if (!EscrowRepository.instance) {
            EscrowRepository.instance = new EscrowRepository();
        }
        return EscrowRepository.instance;
    }

    async createEscrow(data: ICreateEscrowData) {
        try {
            return await this.prisma.escrow.create({
                data: {
                    projectId: data.projectId,
                    depositAmount: data.depositAmount,
                    balance: data.depositAmount
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create escrow");
        }
    }

    async getEscrowById(id: string) {
        try {
            return await this.prisma.escrow.findUnique({
                where: { id },
                include: { project: true }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get escrow");
        }
    }

    async getEscrowByProjectId(projectId: string) {
        try {
            return await this.prisma.escrow.findUnique({
                where: { projectId },
                include: { project: true }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get escrow");
        }
    }

    async updateEscrow(id: string, data: IUpdateEscrowData) {
        try {
            return await this.prisma.escrow.update({
                where: { id },
                data
            });
        } catch (error) {
            throw new AppError(500, "Failed to update escrow");
        }
    }

    async releaseEscrow(escrowId: string, providerProfileId: string) {
        try {
            const escrow = await this.prisma.escrow.findUnique({
                where: { id: escrowId }
            });

            if (!escrow) {
                throw new AppError(404, "Escrow not found");
            }

            // Update escrow status
            const updatedEscrow = await this.prisma.escrow.update({
                where: { id: escrowId },
                data: {
                    status: "RELEASED",
                    releasedAt: new Date(),
                    balance: 0
                }
            });

            // Add released amount to provider's available balance
            await this.prisma.providerProfile.update({
                where: { id: providerProfileId },
                data: {
                    availableBalance: {
                        increment: escrow.balance
                    }
                }
            });

            return updatedEscrow;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, "Failed to release escrow");
        }
    }

    async refundEscrow(escrowId: string) {
        try {
            return await this.prisma.escrow.update({
                where: { id: escrowId },
                data: {
                    status: "REFUNDED",
                    balance: 0
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to refund escrow");
        }
    }

    async addToEscrow(escrowId: string, amount: number) {
        try {
            return await this.prisma.escrow.update({
                where: { id: escrowId },
                data: {
                    balance: { increment: amount }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to add funds to escrow");
        }
    }

    async getProviderBalance(providerProfileId: string) {
        try {
            const profile = await this.prisma.providerProfile.findUnique({
                where: { id: providerProfileId },
                select: { availableBalance: true }
            });
            return profile?.availableBalance || 0;
        } catch (error) {
            throw new AppError(500, "Failed to get provider balance");
        }
    }
}

export default EscrowRepository;
