import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";

class OperationRepository {
    private prisma: PrismaClient;
    static instance: OperationRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): OperationRepository {
        if (!OperationRepository.instance) {
            OperationRepository.instance = new OperationRepository();
        }
        return OperationRepository.instance;
    }

    async createOperation(data: any): Promise<any> {
        try {
            return await this.prisma.operation.create({ data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to create operation");
        }
    }

    async getAllOperations(): Promise<any[]> {
        return await this.prisma.operation.findMany();
    }

    async getOperationById(id: string): Promise<any> {
        return await this.prisma.operation.findUnique({ where: { id } });
    }

    async updateOperation(id: string, data: any): Promise<any> {
        return await this.prisma.operation.update({ where: { id }, data: data as any });
    }

    async deleteOperation(id: string): Promise<any> {
        return await this.prisma.operation.delete({ where: { id } });
    }
}

export default OperationRepository;
