import PrismaClientSingleton from "../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../utils/app-error";
import { ICreateProfileRepositoryData, IUpdateProfileData } from "./types/IProfile";
import { ISearchParamsRequired } from "./types/ISearch";

class ProfileRepository {
    private prisma: PrismaClient;
    static profileRepositoryInstance: ProfileRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): ProfileRepository {
        if (!ProfileRepository.profileRepositoryInstance) {
            ProfileRepository.profileRepositoryInstance = new ProfileRepository();
        }
        return ProfileRepository.profileRepositoryInstance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    // ==================== Provider Profile ====================

    async createProviderProfile(userId: string, data: ICreateProfileRepositoryData) {
        try {
            return await this.prisma.providerProfile.create({
                data: {
                    userId,
                    title: data.title,
                    bio: data.bio,
                    hourlyRate: data.hourlyRate,
                    serviceId: data.serviceId,
                    skills: data.skills ? { create: data.skills } : undefined,
                    experiences: data.experiences ? { create: data.experiences } : undefined,
                    education: data.education ? { create: data.education } : undefined,
                    languages: data.languages ? { create: data.languages } : undefined,
                },
                include: {
                    user: true,
                    service: true,
                    skills: true,
                    experiences: true,
                    education: true,
                    languages: true,
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to create provider profile");
        }
    }

    async getProviderProfileByUserId(userId: string) {
        try {
            return await this.prisma.providerProfile.findUnique({
                where: { userId },
                include: {
                    user: true,
                    service: true,
                    skills: true,
                    experiences: true,
                    education: true,
                    languages: true,
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get provider profile");
        }
    }

    async getProviderProfileById(id: string) {
        try {
            return await this.prisma.providerProfile.findUnique({
                where: { id },
                include: {
                    user: true,
                    service: true,
                    skills: true,
                    experiences: true,
                    education: true,
                    languages: true,
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get provider profile");
        }
    }

    async getAllProviderProfiles(approvedOnly: boolean = false) {
        try {
            return await this.prisma.providerProfile.findMany({
                where: approvedOnly ? { isApproved: true } : undefined,
                include: {
                    user: true,
                    service: true,
                    skills: true,
                    experiences: true,
                    education: true,
                    languages: true,
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get provider profiles");
        }
    }

    async searchProviderProfiles(params: ISearchParamsRequired) {
        try {
            // Build where clause - only approved providers
            const where: any = { isApproved: true };

            // Search by name (user firstName or lastName)
            if (params.q) {
                where.user = {
                    OR: [
                        { firstName: { contains: params.q, mode: "insensitive" } },
                        { lastName: { contains: params.q, mode: "insensitive" } },
                    ],
                };
            }

            // Filter by service
            if (params.serviceId) {
                where.serviceId = params.serviceId;
            }

            // Filter by price range
            if (params.minPrice !== undefined || params.maxPrice !== undefined) {
                where.hourlyRate = {};
                if (params.minPrice !== undefined) {
                    where.hourlyRate.gte = params.minPrice;
                }
                if (params.maxPrice !== undefined) {
                    where.hourlyRate.lte = params.maxPrice;
                }
            }

            // Filter by minimum rating
            if (params.minRating !== undefined) {
                where.averageRating = { gte: params.minRating };
            }

            // Filter by language
            if (params.language) {
                where.languages = {
                    some: { language: { contains: params.language, mode: "insensitive" } },
                };
            }

            // Build orderBy clause
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let orderBy: any = { createdAt: "desc" }; // Default sort
            const order = params.sortOrder || "asc";

            switch (params.sortBy) {
                case "name":
                    orderBy = { user: { firstName: order } };
                    break;
                case "rating":
                    orderBy = { averageRating: order };
                    break;
                case "price":
                    orderBy = { hourlyRate: order };
                    break;
                case "date":
                    orderBy = { createdAt: order };
                    break;
            }

            // Get total count
            const total = await this.prisma.providerProfile.count({ where });

            // Get paginated results
            const profiles = await this.prisma.providerProfile.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            username: true,
                        },
                    },
                    service: true,
                    skills: true,
                    languages: true,
                },
                orderBy,
                skip: (params.page - 1) * params.limit,
                take: params.limit,
            });

            return {
                profiles,
                total,
                page: params.page,
                limit: params.limit,
                totalPages: Math.ceil(total / params.limit),
            };
        } catch (error) {
            throw new AppError(500, "Failed to search provider profiles");
        }
    }

    async updateProviderProfile(profileId: string, data: IUpdateProfileData) {
        try {
            return await this.prisma.providerProfile.update({
                where: { id: profileId },
                data,
                include: {
                    user: true,
                    service: true,
                    skills: true,
                    experiences: true,
                    education: true,
                    languages: true,
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to update provider profile");
        }
    }

    async approveProfile(profileId: string) {
        try {
            return await this.prisma.providerProfile.update({
                where: { id: profileId },
                data: { isApproved: true },
            });
        } catch (error) {
            throw new AppError(500, "Failed to approve profile");
        }
    }

    async rejectProfile(profileId: string) {
        try {
            return await this.prisma.providerProfile.update({
                where: { id: profileId },
                data: { isApproved: false },
            });
        } catch (error) {
            throw new AppError(500, "Failed to reject profile");
        }
    }

    async deleteProviderProfile(profileId: string) {
        try {
            return await this.prisma.providerProfile.delete({
                where: { id: profileId },
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete provider profile");
        }
    }
}

export default ProfileRepository;
