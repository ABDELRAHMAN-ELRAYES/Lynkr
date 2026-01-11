import PrismaClientSingleton from "../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../utils/app-error";
import { ICreateApplicationData, IReviewApplicationData } from "./types/IProviderApplication";

class ProviderApplicationRepository {
    private prisma: PrismaClient;
    static instance: ProviderApplicationRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): ProviderApplicationRepository {
        if (!ProviderApplicationRepository.instance) {
            ProviderApplicationRepository.instance = new ProviderApplicationRepository();
        }
        return ProviderApplicationRepository.instance;
    }

    async createApplication(data: ICreateApplicationData) {
        try {
            return await this.prisma.providerApplication.create({
                data: {
                    userId: data.userId,
                    providerProfileId: data.providerProfileId,
                    status: "PENDING",
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                    providerProfile: true,
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create provider application");
        }
    }

    async getApplicationById(id: string) {
        try {
            return await this.prisma.providerApplication.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                    providerProfile: true,
                    review: {
                        include: {
                            admin: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                }
                            }
                        }
                    },
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get application");
        }
    }

    async getApplicationsByUserId(userId: string) {
        try {
            return await this.prisma.providerApplication.findMany({
                where: { userId },
                include: {
                    review: true,
                },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get user applications");
        }
    }

    async getPendingApplications() {
        try {
            return await this.prisma.providerApplication.findMany({
                where: { status: "PENDING" },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                    providerProfile: {
                        include: {
                            services: true,
                            skills: true,
                            experiences: true,
                            education: true,
                        }
                    },
                },
                orderBy: { createdAt: 'asc' }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get pending applications");
        }
    }

    async hasPendingApplication(userId: string): Promise<boolean> {
        const count = await this.prisma.providerApplication.count({
            where: { userId, status: "PENDING" }
        });
        return count > 0;
    }

    async getLatestRejectedApplication(userId: string) {
        return await this.prisma.providerApplication.findFirst({
            where: { userId, status: "REJECTED" },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async updateApplicationStatus(id: string, status: string, cooldownEndsAt?: Date) {
        try {
            return await this.prisma.providerApplication.update({
                where: { id },
                data: {
                    status,
                    cooldownEndsAt,
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to update application status");
        }
    }

    async createReview(applicationId: string, data: IReviewApplicationData) {
        try {
            return await this.prisma.applicationReview.create({
                data: {
                    applicationId,
                    adminId: data.adminId,
                    decision: data.decision,
                    reason: data.reason,
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create application review");
        }
    }
}

export default ProviderApplicationRepository;
