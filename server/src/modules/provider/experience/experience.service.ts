import ExperienceRepository from "./experience.repository";
import { NextFunction } from "express";
import AppError from "../../../utils/app-error";
import { ICreateExperienceData, IUpdateExperienceData } from "./types/IExperience";

class ExperienceService {
    private static repository = ExperienceRepository.getInstance();

    static async createExperience(data: ICreateExperienceData, next: NextFunction) {
        try {
            return await this.repository.createExperience(data);
        } catch (error) {
            return next(new AppError(500, "Failed to create experience"));
        }
    }

    static async getExperienceById(id: string, next: NextFunction) {
        const experience = await this.repository.getExperienceById(id);
        if (!experience) {
            return next(new AppError(404, "Experience not found"));
        }
        return experience;
    }

    static async getExperiencesByProfileId(profileId: string) {
        return await this.repository.getExperiencesByProfileId(profileId);
    }

    static async updateExperience(id: string, data: IUpdateExperienceData, next: NextFunction) {
        try {
            return await this.repository.updateExperience(id, data);
        } catch (error) {
            return next(new AppError(500, "Failed to update experience"));
        }
    }

    static async deleteExperience(id: string, next: NextFunction) {
        try {
            await this.repository.deleteExperience(id);
        } catch (error) {
            return next(new AppError(500, "Failed to delete experience"));
        }
    }
}

export default ExperienceService;
