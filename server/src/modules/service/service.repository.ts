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

    // TODO: Add Service model to Prisma schema
    async createService(_data: object): Promise<object> {
        throw new AppError(501, "Service module not implemented");
    }

    async getAllServices(): Promise<object[]> {
        throw new AppError(501, "Service module not implemented");
    }

    async getServiceById(_id: string): Promise<object | null> {
        throw new AppError(501, "Service module not implemented");
    }

    async updateService(_id: string, _data: object): Promise<object> {
        throw new AppError(501, "Service module not implemented");
    }

    async deleteService(_id: string): Promise<object> {
        throw new AppError(501, "Service module not implemented");
    }
}

export default ServiceRepository;
