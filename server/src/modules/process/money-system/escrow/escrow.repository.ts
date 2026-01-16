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
            return await this.prisma.$transaction(async (tx) => {
                const escrow = await tx.escrow.findUnique({
                    where: { id: escrowId }
                });

                if (!escrow) {
                    throw new AppError(404, "Escrow not found");
                }

                if (escrow.status === "RELEASED") {
                    throw new AppError(400, "Escrow already released");
                }

                // Update escrow status
                const updatedEscrow = await tx.escrow.update({
                    where: { id: escrowId },
                    data: {
                        status: "RELEASED",
                        releasedAt: new Date(),
                        balance: 0
                    }
                });

                // Add released amount to provider's available balance
                await tx.providerProfile.update({
                    where: { id: providerProfileId },
                    data: {
                        availableBalance: {
                            increment: escrow.balance
                        }
                    }
                });

                return updatedEscrow;
            });
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

    async createWithdrawal(providerProfileId: string, amount: number) {
        try {
            // Deduct from provider's available balance
            const profile = await this.prisma.providerProfile.update({
                where: { id: providerProfileId },
                data: {
                    availableBalance: { decrement: amount }
                },
                select: {
                    id: true,
                    availableBalance: true
                }
            });

            // Return withdrawal info (in production, would create actual record)
            return {
                id: `wth_${Date.now()}`,
                providerProfileId,
                amount,
                status: "PENDING",
                remainingBalance: profile.availableBalance,
                createdAt: new Date()
            };
        } catch (error) {
            throw new AppError(500, "Failed to create withdrawal");
        }
    }

    async getWithdrawalHistory(_providerProfileId: string) {
        // Note: Requires a Withdrawal model in Prisma schema for full implementation
        // For now, return empty array - can be enhanced when model is added
        return [];
    }
}

export default EscrowRepository;
