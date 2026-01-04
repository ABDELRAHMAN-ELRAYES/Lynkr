import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";

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

    async createService(data: any): Promise<any> {
        try {
            return await this.prisma.service.create({ data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to create service");
        }
    }

    async getAllServices(): Promise<any[]> {
        try {
            return await this.prisma.service.findMany();
        } catch (error) {
            throw new AppError(500, "Failed to get services");
        }
    }

    async getServiceById(id: string): Promise<any> {
        try {
            return await this.prisma.service.findUnique({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to get service");
        }
    }

    async updateService(id: string, data: any): Promise<any> {
        try {
            return await this.prisma.service.update({ where: { id }, data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to update service");
        }
    }

    async deleteService(id: string): Promise<any> {
        try {
            return await this.prisma.service.delete({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to delete service");
        }
    }
}

export default ServiceRepository;
