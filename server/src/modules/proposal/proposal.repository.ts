import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";
import { ICreateProposalData, IUpdateProposalData, ProposalStatus } from "./types/IProposal";

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

    async createProposal(data: ICreateProposalData) {
        try {
            return await this.prisma.proposal.create({
                data: {
                    requestId: data.requestId,
                    providerProfileId: data.providerProfileId,
                    price: data.price,
                    priceType: data.priceType,
                    estimatedDays: data.estimatedDays,
                    notes: data.notes,
                    status: "PENDING",
                    attachments: data.files && data.files.length > 0 ? {
                        create: data.files.map(file => ({
                            file: {
                                create: {
                                    filename: file.originalname,
                                    path: file.path,
                                    mimetype: file.mimetype,
                                    size: file.size
                                }
                            }
                        }))
                    } : undefined
                },
                include: {
                    providerProfile: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                }
                            }
                        }
                    }
                }
            });
        } catch (error: any) {
            // Check for unique constraint violation (P2002)
            if (error.code === 'P2002') {
                throw new AppError(400, "You have already submitted a proposal for this request");
            }
            throw new AppError(500, "Failed to create proposal");
        }
    }

    async getProposalsByRequestId(requestId: string) {
        try {
            return await this.prisma.proposal.findMany({
                where: { requestId },
                include: {
                    providerProfile: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                }
                            },
                        }
                    },
                },
                orderBy: { createdAt: 'asc' }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get proposals");
        }
    }

    async getProposalById(id: string) {
        try {
            return await this.prisma.proposal.findUnique({
                where: { id },
                include: {
                    providerProfile: {
                        include: { user: true }
                    },
                    request: true,
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get proposal");
        }
    }

    async updateProposal(id: string, data: IUpdateProposalData) {
        try {
            return await this.prisma.proposal.update({
                where: { id },
                data: {
                    ...data,
                    attachments: data.files && data.files.length > 0 ? {
                        create: data.files.map(file => ({
                            file: {
                                create: {
                                    filename: file.originalname,
                                    path: file.path,
                                    mimetype: file.mimetype,
                                    size: file.size
                                }
                            }
                        }))
                    } : undefined
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to update proposal");
        }
    }

    async updateProposalStatus(id: string, status: ProposalStatus) {
        try {
            return await this.prisma.proposal.update({
                where: { id },
                data: { status },
                include: {
                    request: true,
                    providerProfile: {
                        include: { user: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to update proposal status");
        }
    }

    async rejectOtherProposals(requestId: string, acceptedProposalId: string) {
        try {
            return await this.prisma.proposal.updateMany({
                where: {
                    requestId,
                    id: { not: acceptedProposalId }
                },
                data: { status: "REJECTED" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to reject other proposals");
        }
    }

    async deleteProposal(id: string) {
        try {
            return await this.prisma.proposal.delete({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to delete proposal");
        }
    }
}

export default ProposalRepository;
