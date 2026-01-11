import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../utils/catch-async";
import ExperienceService from "./experience.service";
import { ICreateExperienceData, IUpdateExperienceData } from "./types/IExperience";

export const createExperience = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const data: ICreateExperienceData = request.body;
        const experience = await ExperienceService.createExperience(data, next);
        if (!experience) return;

        response.status(201).json({
            status: "success",
            message: "Experience created successfully",
            data: { experience },
        });
    }
);

export const getExperience = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const experience = await ExperienceService.getExperienceById(id, next);
        if (!experience) return;

        response.status(200).json({
            status: "success",
            data: { experience },
        });
    }
);

export const getExperiencesByProfile = catchAsync(
    async (request: Request, response: Response) => {
        const { profileId } = request.params;
        const experiences = await ExperienceService.getExperiencesByProfileId(profileId);

        response.status(200).json({
            status: "success",
            data: { experiences, count: experiences.length },
        });
    }
);

export const updateExperience = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const data: IUpdateExperienceData = request.body;
        const experience = await ExperienceService.updateExperience(id, data, next);
        if (!experience) return;

        response.status(200).json({
            status: "success",
            message: "Experience updated successfully",
            data: { experience },
        });
    }
);

export const deleteExperience = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        await ExperienceService.deleteExperience(id, next);

        response.status(204).json({
            status: "success",
            data: null,
        });
    }
);
