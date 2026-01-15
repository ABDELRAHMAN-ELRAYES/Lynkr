import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../utils/catch-async";
import ProfileService from "./profile.service";
import { IUser } from "../../user/types/IUser";
import { ICreateProfileData, IUpdateProfileData } from "./types/IProfile";
import { SortBy, SortOrder } from "./types/ISearch";

/**
 * Create Provider Profile
 */
export const createProviderProfile = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;
        const data: ICreateProfileData = { ...request.body, userId: user.id };

        const profile = await ProfileService.createProviderProfile(user.id, data, next);
        if (!profile) return;

        response.status(201).json({
            status: "success",
            message: "Provider profile created successfully",
            data: { profile },
        });
    }
);

/**
 * Get Provider Profile by User ID
 */
export const getProviderProfileByUserId = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const userId = request.params.userId;
        const profile = await ProfileService.getProviderProfileByUserId(userId, next);
        if (!profile) return;

        response.status(200).json({
            status: "success",
            data: { profile },
        });
    }
);

/**
 * Get Provider Profile by ID
 */
export const getProviderProfileById = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const profileId = request.params.id;
        const profile = await ProfileService.getProviderProfileById(profileId, next);
        if (!profile) return;

        response.status(200).json({
            status: "success",
            data: { profile },
        });
    }
);

/**
 * Get All Provider Profiles
 */
export const getAllProviderProfiles = catchAsync(
    async (request: Request, response: Response) => {
        const approvedOnly = request.query.approved === "true";
        const profiles = await ProfileService.getAllProviderProfiles(approvedOnly);

        response.status(200).json({
            status: "success",
            data: { profiles, count: profiles.length },
        });
    }
);

/**
 * Search Provider Profiles
 */
export const searchProviderProfiles = catchAsync(
    async (request: Request, response: Response) => {
        const {
            q,
            serviceId,
            minPrice,
            maxPrice,
            minRating,
            language,
            sortBy,
            sortOrder,
            page,
            limit,
        } = request.query;

        const result = await ProfileService.searchProviderProfiles({
            q: q as string,
            serviceId: serviceId as string,
            minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
            minRating: minRating ? parseFloat(minRating as string) : undefined,
            language: language as string,
            sortBy: sortBy as SortBy,
            sortOrder: sortOrder as SortOrder,
            page: page ? parseInt(page as string, 10) : 1,
            limit: limit ? parseInt(limit as string, 10) : 10,
        });

        response.status(200).json({
            status: "success",
            data: result,
        });
    }
);

/**
 * Update Provider Profile
 */
export const updateProviderProfile = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const profileId = request.params.id;
        const data: IUpdateProfileData = request.body;

        const profile = await ProfileService.updateProviderProfile(profileId, data, next);
        if (!profile) return;

        response.status(200).json({
            status: "success",
            message: "Provider profile updated successfully",
            data: { profile },
        });
    }
);

/**
 * Approve Provider Profile (Admin only)
 */
export const approveProviderProfile = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const profileId = request.params.id;

        const result = await ProfileService.approveProviderProfile(profileId, next);
        if (!result) return;

        response.status(200).json({
            status: "success",
            message: result.message,
        });
    }
);

/**
 * Reject Provider Profile (Admin only)
 */
export const rejectProviderProfile = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const profileId = request.params.id;

        const result = await ProfileService.rejectProviderProfile(profileId, next);
        if (!result) return;

        response.status(200).json({
            status: "success",
            message: result.message,
        });
    }
);

/**
 * Delete Provider Profile
 */
export const deleteProviderProfile = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const profileId = request.params.id;

        await ProfileService.deleteProviderProfile(profileId, next);

        response.status(204).json({
            status: "success",
            data: null,
        });
    }
);
