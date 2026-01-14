import PrismaClientSingleton from "../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../utils/app-error";
import { ICreateProjectReviewData, ICreateSessionReviewData } from "./types/IReview";

class ReviewRepository {
    private prisma: PrismaClient;
    static instance: ReviewRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): ReviewRepository {
        if (!ReviewRepository.instance) {
            ReviewRepository.instance = new ReviewRepository();
        }
        return ReviewRepository.instance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    // ===== CREATE OPERATIONS =====

    async createProjectReview(data: ICreateProjectReviewData) {
        try {
            return await this.prisma.review.create({
                data: {
                    reviewerId: data.reviewerId,
                    targetUserId: data.targetUserId,
                    rating: data.rating,
                    comment: data.comment,
                    reviewType: data.reviewType,
                    projectReview: {
                        create: {
                            projectId: data.projectId
                        }
                    }
                },
                include: {
                    projectReview: true,
                    reviewer: {
                        select: { id: true, firstName: true, lastName: true }
                    },
                    targetUser: {
                        select: { id: true, firstName: true, lastName: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create project review");
        }
    }

    async createSessionReview(data: ICreateSessionReviewData) {
        try {
            return await this.prisma.review.create({
                data: {
                    reviewerId: data.reviewerId,
                    targetUserId: data.targetUserId,
                    rating: data.rating,
                    comment: data.comment,
                    reviewType: data.reviewType,
                    sessionReview: {
                        create: {
                            sessionId: data.sessionId
                        }
                    }
                },
                include: {
                    sessionReview: true,
                    reviewer: {
                        select: { id: true, firstName: true, lastName: true }
                    },
                    targetUser: {
                        select: { id: true, firstName: true, lastName: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create session review");
        }
    }

    // ===== READ OPERATIONS =====

    async getReviewById(id: string) {
        try {
            return await this.prisma.review.findUnique({
                where: { id },
                include: {
                    projectReview: true,
                    sessionReview: true,
                    reviewer: {
                        select: { id: true, firstName: true, lastName: true }
                    },
                    targetUser: {
                        select: { id: true, firstName: true, lastName: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get review");
        }
    }

    async getReviewsGivenByUser(userId: string) {
        try {
            return await this.prisma.review.findMany({
                where: { reviewerId: userId },
                include: {
                    projectReview: {
                        include: {
                            project: {
                                select: {
                                    id: true,
                                    status: true,
                                    acceptedProposal: {
                                        select: {
                                            request: {
                                                select: { title: true }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    sessionReview: {
                        include: {
                            session: {
                                select: { id: true, status: true }
                            }
                        }
                    },
                    targetUser: {
                        select: { id: true, firstName: true, lastName: true }
                    }
                },
                orderBy: { createdAt: "desc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get reviews given");
        }
    }

    async getReviewsReceivedByUser(userId: string) {
        try {
            return await this.prisma.review.findMany({
                where: { targetUserId: userId },
                include: {
                    projectReview: {
                        include: {
                            project: {
                                select: {
                                    id: true,
                                    status: true,
                                    acceptedProposal: {
                                        select: {
                                            request: {
                                                select: { title: true }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    sessionReview: {
                        include: {
                            session: {
                                select: { id: true, status: true }
                            }
                        }
                    },
                    reviewer: {
                        select: { id: true, firstName: true, lastName: true }
                    }
                },
                orderBy: { createdAt: "desc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get reviews received");
        }
    }

    async getProviderReviews(providerUserId: string) {
        try {
            return await this.prisma.review.findMany({
                where: {
                    targetUserId: providerUserId,
                    reviewType: "CLIENT_TO_PROVIDER"
                },
                include: {
                    projectReview: {
                        include: {
                            project: {
                                select: {
                                    id: true,
                                    acceptedProposal: {
                                        select: {
                                            request: {
                                                select: { title: true }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    sessionReview: {
                        include: {
                            session: {
                                select: { id: true }
                            }
                        }
                    },
                    reviewer: {
                        select: { id: true, firstName: true, lastName: true }
                    }
                },
                orderBy: { createdAt: "desc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get provider reviews");
        }
    }

    // ===== CHECK EXISTING REVIEWS =====

    async getExistingProjectReview(reviewerId: string, projectId: string) {
        try {
            return await this.prisma.review.findFirst({
                where: {
                    reviewerId,
                    projectReview: {
                        projectId
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to check existing project review");
        }
    }

    async getExistingSessionReview(reviewerId: string, sessionId: string) {
        try {
            return await this.prisma.review.findFirst({
                where: {
                    reviewerId,
                    sessionReview: {
                        sessionId
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to check existing session review");
        }
    }

    // ===== PROVIDER RATING STATS =====

    async getProviderRatingStats(providerUserId: string) {
        try {
            const stats = await this.prisma.review.aggregate({
                where: {
                    targetUserId: providerUserId,
                    reviewType: "CLIENT_TO_PROVIDER"
                },
                _avg: { rating: true },
                _count: { rating: true }
            });

            return {
                averageRating: stats._avg.rating,
                totalReviews: stats._count.rating
            };
        } catch (error) {
            throw new AppError(500, "Failed to get provider rating stats");
        }
    }

    async updateProviderRatingStats(providerProfileId: string, averageRating: number, totalReviews: number) {
        try {
            return await this.prisma.providerProfile.update({
                where: { id: providerProfileId },
                data: {
                    averageRating,
                    totalReviews
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to update provider rating stats");
        }
    }

    // ===== ENGAGEMENT QUERIES =====

    async getProjectWithParticipants(projectId: string) {
        try {
            return await this.prisma.project.findUnique({
                where: { id: projectId },
                include: {
                    client: { select: { id: true } },
                    providerProfile: {
                        select: {
                            id: true,
                            userId: true
                        }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get project");
        }
    }

    async getSessionWithParticipants(sessionId: string) {
        try {
            return await this.prisma.teachingSession.findUnique({
                where: { id: sessionId },
                include: {
                    slot: {
                        include: {
                            providerProfile: {
                                select: {
                                    id: true,
                                    userId: true
                                }
                            }
                        }
                    },
                    participants: {
                        select: {
                            userId: true
                        }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get session");
        }
    }
}

export default ReviewRepository;
