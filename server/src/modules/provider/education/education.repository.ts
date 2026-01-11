import PrismaClientSingleton from "../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../utils/app-error";
import { IEducation, ICreateEducationData, IUpdateEducationData } from "./types/IEducation";

class EducationRepository {
    private prisma: PrismaClient;
    private static instance: EducationRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): EducationRepository {
        if (!EducationRepository.instance) {
            EducationRepository.instance = new EducationRepository();
        }
        return EducationRepository.instance;
    }

    async createEducation(data: ICreateEducationData): Promise<IEducation> {
        try {
            return await this.prisma.providerEducation.create({
                data: {
                    providerProfileId: data.providerProfileId,
                    school: data.school,
                    degree: data.degree,
                    fieldOfStudy: data.fieldOfStudy,
                    description: data.description,
                    startDate: new Date(data.startDate),
                    endDate: data.endDate ? new Date(data.endDate) : null,
                },
            }) as IEducation;
        } catch (error) {
            throw new AppError(500, "Failed to create education");
        }
    }

    async getEducationById(id: string): Promise<IEducation | null> {
        try {
            return await this.prisma.providerEducation.findUnique({
                where: { id },
            }) as IEducation | null;
        } catch (error) {
            throw new AppError(500, "Failed to get education");
        }
    }

    async getEducationsByProfileId(profileId: string): Promise<IEducation[]> {
        try {
            return await this.prisma.providerEducation.findMany({
                where: { providerProfileId: profileId },
                orderBy: { startDate: 'desc' },
            }) as IEducation[];
        } catch (error) {
            throw new AppError(500, "Failed to get education records");
        }
    }

    async updateEducation(id: string, data: IUpdateEducationData): Promise<IEducation> {
        try {
            const updateData: any = { ...data };
            if (data.startDate) updateData.startDate = new Date(data.startDate);
            if (data.endDate) updateData.endDate = new Date(data.endDate);

            return await this.prisma.providerEducation.update({
                where: { id },
                data: updateData,
            }) as IEducation;
        } catch (error) {
            throw new AppError(500, "Failed to update education");
        }
    }

    async deleteEducation(id: string): Promise<void> {
        try {
            await this.prisma.providerEducation.delete({
                where: { id },
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete education");
        }
    }
}

export default EducationRepository;
