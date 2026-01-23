import ProfileRepository from "./profile.repository";
import UserRepository from "../../user/user.repository";
import NotificationService from "../../notification/notification.service";
import { NextFunction } from "express";
import AppError from "../../../utils/app-error";
import { UserRole } from "../../../enum/UserRole";
import { ICreateProfileData, IUpdateProfileData, ICreateProfileRepositoryData } from "./types/IProfile";
import { ISearchParams, SortBy } from "./types/ISearch";

class ProfileService {
    private static profileRepository = ProfileRepository.getInstance();

    /**
     * Create Provider Profile with all related data
     */
    static async createProviderProfile(userId: string, data: ICreateProfileData, next: NextFunction) {
        try {
            // Check if profile already exists
            const existingProfile = await this.profileRepository.getProviderProfileByUserId(userId);
            if (existingProfile) {
                return next(new AppError(400, "Provider profile already exists for this user"));
            }

            // Prepare data for repository (transform dates and structure)
            const experiences = data.experiences?.map(exp => ({
                title: exp.title,
                company: exp.company,
                location: exp.location,
                country: exp.country,
                description: exp.description,
                startDate: new Date(exp.startDate),
                endDate: exp.endDate ? new Date(exp.endDate) : undefined,
            }));

            const education = data.education?.map(edu => ({
                school: edu.school,
                degree: edu.degree,
                fieldOfStudy: edu.fieldOfStudy,
                description: edu.description,
                startDate: new Date(edu.startDate),
                endDate: edu.endDate ? new Date(edu.endDate) : undefined,
            }));

            // Prepare repository data
            const repositoryData: ICreateProfileRepositoryData = {
                title: data.title,
                bio: data.bio,
                hourlyRate: data.hourlyRate,
                serviceId: data.serviceId || data.serviceType, // Use serviceId if provided, fallback to serviceType
                skills: data.skills?.map(name => ({ skillName: name })),
                experiences,
                education,
                languages: data.languages,
            };

            // Create profile with prepared data
            const profile = await this.profileRepository.createProviderProfile(userId, repositoryData);

            return profile;
        } catch (error) {
            return next(new AppError(500, "Failed to create provider profile"));
        }
    }

    /**
     * Get Provider Profile by User ID
     */
    static async getProviderProfileByUserId(userId: string, next: NextFunction) {
        const profile = await this.profileRepository.getProviderProfileByUserId(userId);
        if (!profile) {
            next(new AppError(404, "Provider profile not found"));
            return;
        }
        return profile;
    }

    /**
     * Get Provider Profile by ID
     */
    static async getProviderProfileById(profileId: string, next: NextFunction) {
        const profile = await this.profileRepository.getProviderProfileById(profileId);
        if (!profile) {
            next(new AppError(404, "Provider profile not found"));
            return;
        }
        return profile;
    }

    /**
     * Get All Provider Profiles (optionally only approved)
     */
    static async getAllProviderProfiles(approvedOnly: boolean = false) {
        return await this.profileRepository.getAllProviderProfiles(approvedOnly);
    }

    /**
     * Search Provider Profiles with filters, sorting, and pagination
     */
    static async searchProviderProfiles(params: ISearchParams) {
        const page = params.page || 1;
        const limit = params.limit || 10;

        return await this.profileRepository.searchProviderProfiles({
            ...params,
            sortBy: params.sortBy as SortBy,
            page,
            limit,
        });
    }

    /**
     * Update Provider Profile
     */
    static async updateProviderProfile(profileId: string, data: IUpdateProfileData, next: NextFunction) {
        try {
            return await this.profileRepository.updateProviderProfile(profileId, data);
        } catch (error) {
            return next(new AppError(500, "Failed to update provider profile"));
        }
    }

    /**
     * Approve Provider Profile (Admin only)
     * Changes user role to PROVIDER_APPROVED
     */
    static async approveProviderProfile(profileId: string, next: NextFunction) {
        try {
            const profile = await this.profileRepository.getProviderProfileById(profileId);
            if (!profile) {
                return next(new AppError(404, "Provider profile not found"));
            }

            // Update profile approval status
            await this.profileRepository.approveProfile(profileId);

            // Update user role to PROVIDER_APPROVED directly via UserRepository
            const userRepository = UserRepository.getInstance();
            await userRepository.getPrismaClient().user.update({
                where: { id: profile.userId },
                data: { role: UserRole.PROVIDER_APPROVED },
            });

            // Notify provider
            await NotificationService.sendSystemNotification(
                profile.userId,
                "Profile Approved!",
                "Congratulations! Your provider profile has been approved. You can now receive service requests."
            );

            return { message: "Provider profile approved successfully" };
        } catch (error) {
            return next(new AppError(500, "Failed to approve provider profile"));
        }
    }

    /**
     * Reject Provider Profile (Admin only)
     * Changes user role to PROVIDER_REJECTED
     */
    static async rejectProviderProfile(profileId: string, next: NextFunction) {
        try {
            const profile = await this.profileRepository.getProviderProfileById(profileId);
            if (!profile) {
                return next(new AppError(404, "Provider profile not found"));
            }

            // Update profile approval status
            await this.profileRepository.rejectProfile(profileId);

            // Update user role to PROVIDER_REJECTED directly via UserRepository
            const userRepository = UserRepository.getInstance();
            await userRepository.getPrismaClient().user.update({
                where: { id: profile.userId },
                data: { role: UserRole.PROVIDER_REJECTED },
            });

            // Notify provider
            await NotificationService.sendSystemNotification(
                profile.userId,
                "Profile Not Approved",
                "Your provider profile application was not approved. Please review and resubmit."
            );

            return { message: "Provider profile rejected" };
        } catch (error) {
            return next(new AppError(500, "Failed to reject provider profile"));
        }
    }

    /**
     * Delete Provider Profile
     */
    static async deleteProviderProfile(profileId: string, next: NextFunction) {
        try {
            return await this.profileRepository.deleteProviderProfile(profileId);
        } catch (error) {
            return next(new AppError(500, "Failed to delete provider profile"));
        }
    }
}

export default ProfileService;
