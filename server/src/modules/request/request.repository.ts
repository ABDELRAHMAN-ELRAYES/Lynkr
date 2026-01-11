import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "@/utils/app-error";
import { IRequestRepositoryData, IUpdateRequestData } from "./types/IRequest";

class RequestRepository {
    private prisma: PrismaClient;
    static instance: RequestRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): RequestRepository {
        if (!RequestRepository.instance) {
            RequestRepository.instance = new RequestRepository();
        }
        return RequestRepository.instance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    async createRequest(data: IRequestRepositoryData) {
        try {
            return await this.prisma.request.create({
                data: {
                    clientId: data.clientId,
                    targetProviderId: data.targetProviderId,
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    budgetType: data.budgetType,
                    budgetCurrency: data.budgetCurrency,
                    fromBudget: data.fromBudget,
                    toBudget: data.toBudget,
                    deadline: data.deadline,
                    responseDeadline: data.responseDeadline,
                    status: data.status,
                    isPublic: data.isPublic,
                    ndaRequired: data.ndaRequired,
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
                    client: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            username: true,
                        }
                    },
                    targetProvider: {
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
        } catch (error) {
            console.error("Create request error:", error);
            throw new AppError(500, "Failed to create request");
        }
    }

    async getRequestById(id: string) {
        try {
            return await this.prisma.request.findUnique({
                where: { id },
                include: {
                    client: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            username: true,
                        }
                    },
                    targetProvider: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                }
                            }
                        }
                    },
                    proposals: {
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
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get request");
        }
    }

    async getRequestsByClientId(clientId: string) {
        try {
            return await this.prisma.request.findMany({
                where: { clientId },
                orderBy: { createdAt: 'desc' },
                include: {
                    targetProvider: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                }
                            }
                        }
                    },
                    _count: {
                        select: { proposals: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get client requests");
        }
    }

    async getRequestsForProvider(providerId: string, serviceCategories: string[]) {
        try {
            return await this.prisma.request.findMany({
                where: {
                    OR: [
                        { targetProviderId: providerId }, // Direct requests
                        {
                            isPublic: true,
                            category: { in: serviceCategories },
                            status: "PUBLIC"
                        }
                    ],
                    status: { not: "DRAFT" }
                },
                orderBy: { createdAt: 'desc' },
                include: {
                    client: {
                        select: {
                            firstName: true,
                            lastName: true,
                        }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get provider requests");
        }
    }

    async updateRequest(id: string, data: IUpdateRequestData) {
        try {
            return await this.prisma.request.update({
                where: { id },
                data: {
                    ...data,
                    deadline: data.deadline ? new Date(data.deadline) : undefined,
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
            throw new AppError(500, "Failed to update request");
        }
    }

    async updateRequestStatus(id: string, status: string, isPublic?: boolean) {
        try {
            const data: any = { status };
            if (isPublic !== undefined) {
                data.isPublic = isPublic;
            }

            return await this.prisma.request.update({
                where: { id },
                data,
            });
        } catch (error) {
            throw new AppError(500, "Failed to update request status");
        }
    }

    async getExpiredDirectRequests() {
        // Find requests that are PENDING, not public, and responseDeadline has passed
        const now = new Date();
        try {
            return await this.prisma.request.findMany({
                where: {
                    status: "PENDING",
                    isPublic: false,
                    targetProviderId: { not: null },
                    responseDeadline: { lt: now }
                }
            });
        } catch (error) {
            console.error("Error getting expired requests:", error);
            return [];
        }
    }
}

export default RequestRepository;
