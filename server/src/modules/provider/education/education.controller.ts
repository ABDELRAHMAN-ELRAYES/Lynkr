import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../utils/catch-async";
import EducationService from "./education.service";
import { ICreateEducationData, IUpdateEducationData } from "./types/IEducation";

export const createEducation = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const data: ICreateEducationData = request.body;
        const education = await EducationService.createEducation(data, next);
        if (!education) return;

        response.status(201).json({
            status: "success",
            message: "Education created successfully",
            data: { education },
        });
    }
);

export const getEducation = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const education = await EducationService.getEducationById(id, next);
        if (!education) return;

        response.status(200).json({
            status: "success",
            data: { education },
        });
    }
);

export const getEducationsByProfile = catchAsync(
    async (request: Request, response: Response) => {
        const { profileId } = request.params;
        const educations = await EducationService.getEducationsByProfileId(profileId);

        response.status(200).json({
            status: "success",
            data: { educations, count: educations.length },
        });
    }
);

export const updateEducation = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const data: IUpdateEducationData = request.body;
        const education = await EducationService.updateEducation(id, data, next);
        if (!education) return;

        response.status(200).json({
            status: "success",
            message: "Education updated successfully",
            data: { education },
        });
    }
);

export const deleteEducation = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        await EducationService.deleteEducation(id, next);

        response.status(204).json({
            status: "success",
            data: null,
        });
    }
);
