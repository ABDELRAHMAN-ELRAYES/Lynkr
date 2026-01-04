import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import { CreateProfileRequest, ProfileResponse } from "./types/IProfile";
import AppError from "../../utils/app-error";

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

    async createProfile(data: CreateProfileRequest): Promise<any> {
        try {
            return await this.prisma.profile.create({
                data: {
                    userId: data.userId,
                    bio: data.bio,
                    title: data.title,
                    hourlyRate: data.hourlyRate,
                    availability: data.availability,
                } as any,
                include: {
                    user: true,
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to create profile");
        }
    }

    async getProfileByUserId(userId: string): Promise<any> {
        try {
            return await this.prisma.profile.findFirst({
                where: { userId },
                include: {
                    user: true,
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get profile");
        }
    }

    async getAllProfiles(): Promise<any[]> {
        try {
            return await this.prisma.profile.findMany({
                include: {
                    user: true,
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get profiles");
        }
    }

    async updateProfile(profileId: string, data: Partial<CreateProfileRequest>): Promise<any> {
        try {
            return await this.prisma.profile.update({
                where: { id: profileId },
                data: data as any,
            });
        } catch (error) {
            throw new AppError(500, "Failed to update profile");
        }
    }

    async deleteProfile(profileId: string): Promise<any> {
        try {
            return await this.prisma.profile.delete({
                where: { id: profileId },
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete profile");
        }
    }
}

export default ProfileRepository;
