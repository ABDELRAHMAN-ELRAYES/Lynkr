import PrismaClientSingleton from "../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../utils/app-error";
import { ICreateProfileRepositoryData, IUpdateProfileData } from "./types/IProfile";

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
                    services: data.services ? { create: data.services } : undefined,
                    skills: data.skills ? { create: data.skills } : undefined,
                    experiences: data.experiences ? { create: data.experiences } : undefined,
                    education: data.education ? { create: data.education } : undefined,
                    languages: data.languages ? { create: data.languages } : undefined,
                },
                include: {
                    user: true,
                    services: true,
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
                    services: true,
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
                    services: true,
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
                    services: true,
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

    async updateProviderProfile(profileId: string, data: IUpdateProfileData) {
        try {
            return await this.prisma.providerProfile.update({
                where: { id: profileId },
                data,
                include: {
                    user: true,
                    services: true,
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
