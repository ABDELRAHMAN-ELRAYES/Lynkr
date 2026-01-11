import PrismaClientSingleton from "../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../utils/app-error";
import { IExperience, ICreateExperienceData, IUpdateExperienceData } from "./types/IExperience";

class ExperienceRepository {
    private prisma: PrismaClient;
    private static instance: ExperienceRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): ExperienceRepository {
        if (!ExperienceRepository.instance) {
            ExperienceRepository.instance = new ExperienceRepository();
        }
        return ExperienceRepository.instance;
    }

    async createExperience(data: ICreateExperienceData): Promise<IExperience> {
        try {
            return await this.prisma.providerExperience.create({
                data: {
                    providerProfileId: data.providerProfileId,
                    title: data.title,
                    company: data.company,
                    location: data.location,
                    country: data.country,
                    description: data.description,
                    startDate: new Date(data.startDate),
                    endDate: data.endDate ? new Date(data.endDate) : null,
                },
            }) as IExperience;
        } catch (error) {
            throw new AppError(500, "Failed to create experience");
        }
    }

    async getExperienceById(id: string): Promise<IExperience | null> {
        try {
            return await this.prisma.providerExperience.findUnique({
                where: { id },
            }) as IExperience | null;
        } catch (error) {
            throw new AppError(500, "Failed to get experience");
        }
    }

    async getExperiencesByProfileId(profileId: string): Promise<IExperience[]> {
        try {
            return await this.prisma.providerExperience.findMany({
                where: { providerProfileId: profileId },
                orderBy: { startDate: 'desc' },
            }) as IExperience[];
        } catch (error) {
            throw new AppError(500, "Failed to get experiences");
        }
    }

    async updateExperience(id: string, data: IUpdateExperienceData): Promise<IExperience> {
        try {
            const updateData: any = { ...data };
            if (data.startDate) updateData.startDate = new Date(data.startDate);
            if (data.endDate) updateData.endDate = new Date(data.endDate);

            return await this.prisma.providerExperience.update({
                where: { id },
                data: updateData,
            }) as IExperience;
        } catch (error) {
            throw new AppError(500, "Failed to update experience");
        }
    }

    async deleteExperience(id: string): Promise<void> {
        try {
            await this.prisma.providerExperience.delete({
                where: { id },
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete experience");
        }
    }
}

export default ExperienceRepository;
