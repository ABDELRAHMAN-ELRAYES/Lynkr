import ProfileRepository from "./profile.repository";
import { CreateProfileRequest } from "./types/IProfile";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";

class ProfileService {
    private static profileRepository = ProfileRepository.getInstance();

    static async createProfile(data: CreateProfileRequest, next: NextFunction) {
        try {
            const existingProfile = await this.profileRepository.getProfileByUserId(data.userId);
            if (existingProfile) {
                return next(new AppError(400, "Profile already exists for this user"));
            }
            return await this.profileRepository.createProfile(data);
        } catch (error) {
            return next(new AppError(500, "Failed to create profile"));
        }
    }

    static async getProfileByUserId(userId: string, next: NextFunction) {
        const profile = await this.profileRepository.getProfileByUserId(userId);
        if (!profile) {
            next(new AppError(404, "Profile not found"));
            return;
        }
        return profile;
    }

    static async getAllProfiles() {
        return await this.profileRepository.getAllProfiles();
    }

    static async updateProfile(profileId: string, data: Partial<CreateProfileRequest>, next: NextFunction) {
        return await this.profileRepository.updateProfile(profileId, data);
    }

    static async deleteProfile(profileId: string, next: NextFunction) {
        return await this.profileRepository.deleteProfile(profileId);
    }
}

export default ProfileService;
