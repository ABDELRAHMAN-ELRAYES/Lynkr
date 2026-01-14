import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";
import { ICreateServiceData, IUpdateServiceData, ICreateSkillData } from "./types/IService";

class ServiceRepository {
    private prisma: PrismaClient;
    static serviceRepositoryInstance: ServiceRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): ServiceRepository {
        if (!ServiceRepository.serviceRepositoryInstance) {
            ServiceRepository.serviceRepositoryInstance = new ServiceRepository();
        }
        return ServiceRepository.serviceRepositoryInstance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    // ===== SERVICE OPERATIONS =====

    async createService(data: ICreateServiceData) {
        try {
            return await this.prisma.service.create({
                data: {
                    name: data.name,
                    description: data.description
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create service");
        }
    }

    async getAllServices(activeOnly: boolean = true) {
        try {
            const where = activeOnly ? { isActive: true } : {};
            return await this.prisma.service.findMany({
                where,
                include: { skills: { where: { isActive: true } } },
                orderBy: { name: "asc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get services");
        }
    }

    async getServiceById(id: string) {
        try {
            return await this.prisma.service.findUnique({
                where: { id },
                include: { skills: { where: { isActive: true } } }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get service");
        }
    }

    async updateService(id: string, data: IUpdateServiceData) {
        try {
            return await this.prisma.service.update({
                where: { id },
                data
            });
        } catch (error) {
            throw new AppError(500, "Failed to update service");
        }
    }

    async deleteService(id: string) {
        try {
            return await this.prisma.service.update({
                where: { id },
                data: { isActive: false }
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete service");
        }
    }

    // ===== SKILL OPERATIONS =====

    async createSkill(data: ICreateSkillData) {
        try {
            return await this.prisma.skill.create({
                data: {
                    name: data.name,
                    serviceId: data.serviceId
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create skill");
        }
    }

    async getSkillsByServiceId(serviceId: string) {
        try {
            return await this.prisma.skill.findMany({
                where: { serviceId, isActive: true },
                orderBy: { name: "asc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get skills");
        }
    }

    async deleteSkill(id: string) {
        try {
            return await this.prisma.skill.update({
                where: { id },
                data: { isActive: false }
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete skill");
        }
    }
}

export default ServiceRepository;
