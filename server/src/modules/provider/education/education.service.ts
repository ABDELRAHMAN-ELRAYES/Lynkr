import EducationRepository from "./education.repository";
import { NextFunction } from "express";
import AppError from "../../../utils/app-error";
import { ICreateEducationData, IUpdateEducationData } from "./types/IEducation";

class EducationService {
    private static repository = EducationRepository.getInstance();

    static async createEducation(data: ICreateEducationData, next: NextFunction) {
        try {
            return await this.repository.createEducation(data);
        } catch (error) {
            return next(new AppError(500, "Failed to create education"));
        }
    }

    static async getEducationById(id: string, next: NextFunction) {
        const education = await this.repository.getEducationById(id);
        if (!education) {
            return next(new AppError(404, "Education not found"));
        }
        return education;
    }

    static async getEducationsByProfileId(profileId: string) {
        return await this.repository.getEducationsByProfileId(profileId);
    }

    static async updateEducation(id: string, data: IUpdateEducationData, next: NextFunction) {
        try {
            return await this.repository.updateEducation(id, data);
        } catch (error) {
            return next(new AppError(500, "Failed to update education"));
        }
    }

    static async deleteEducation(id: string, next: NextFunction) {
        try {
            await this.repository.deleteEducation(id);
        } catch (error) {
            return next(new AppError(500, "Failed to delete education"));
        }
    }
}

export default EducationService;
