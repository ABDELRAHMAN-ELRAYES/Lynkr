import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import ProfileService from "./profile.service";
import { CreateProfileRequest } from "./types/IProfile";

export const createProfile = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const data: CreateProfileRequest = request.body;
        const profile = await ProfileService.createProfile(data, next);
        if (!profile) return;
        response.status(201).json({ status: "success", data: { profile } });
    }
);

export const getProfileByUserId = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const userId = request.params.userId;
        const profile = await ProfileService.getProfileByUserId(userId, next);
        if (!profile) return;
        response.status(200).json({ status: "success", data: { profile } });
    }
);

export const getAllProfiles = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const profiles = await ProfileService.getAllProfiles();
        response.status(200).json({ status: "success", data: { profiles } });
    }
);

export const updateProfile = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const profileId = request.params.id;
        const data = request.body;
        const profile = await ProfileService.updateProfile(profileId, data, next);
        response.status(200).json({ status: "success", data: { profile } });
    }
);

export const deleteProfile = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const profileId = request.params.id;
        await ProfileService.deleteProfile(profileId, next);
        response.status(204).json({ status: "success", data: null });
    }
);
