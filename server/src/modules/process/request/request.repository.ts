import PrismaClientSingleton from "../../../data-server-clients/prisma-client";
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
                    enableAutoPublish: data.enableAutoPublish,
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

    async getRequestsForProvider(providerId: string, serviceCategory?: string) {
        try {
            // Build the OR conditions for the query
            const orConditions: any[] = [
                { targetProviderId: providerId } // Direct requests targeted to this provider
            ];

            // Add public requests if service category is provided
            if (serviceCategory) {
                orConditions.push({
                    isPublic: true,
                    status: "PUBLIC",
                    category: serviceCategory
                });
            }

            // Return direct requests + public requests matching service category
            return await this.prisma.request.findMany({
                where: {
                    status: { not: "DRAFT" },
                    OR: orConditions
                },
                orderBy: { createdAt: 'desc' },
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
                    },
                    _count: {
                        select: { proposals: true }
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

    /**
     * Get paginated public requests with optional category filter
     */
    async getPublicRequests(params: {
        page: number;
        limit: number;
        category?: string;
        search?: string;
    }) {
        try {
            const { page, limit, category, search } = params;
            const skip = (page - 1) * limit;

            // Build where clause
            const where: any = {
                status: "PUBLIC",
                isPublic: true,
            };

            // Filter by category if provided
            if (category) {
                where.category = category;
            }

            // Search filter
            if (search) {
                where.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ];
            }

            // Get total count
            const total = await this.prisma.request.count({ where });

            // Get paginated results
            const requests = await this.prisma.request.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    client: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                        }
                    },
                    _count: {
                        select: { proposals: true }
                    }
                }
            });

            return {
                requests,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        } catch (error) {
            throw new AppError(500, "Failed to get public requests");
        }
    }
}

export default RequestRepository;
