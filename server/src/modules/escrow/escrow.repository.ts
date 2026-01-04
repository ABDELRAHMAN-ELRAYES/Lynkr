import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";

class EscrowRepository {
    private prisma: PrismaClient;
    static instance: EscrowRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): EscrowRepository {
        if (!EscrowRepository.instance) {
            EscrowRepository.instance = new EscrowRepository();
        }
        return EscrowRepository.instance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    async createEscrow(data: any): Promise<any> {
        try {
            return await this.prisma.escrow.create({ data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to create escrow");
        }
    }

    async getEscrowByProjectId(projectId: string): Promise<any> {
        try {
            return await this.prisma.escrow.findFirst({ where: { projectId } });
        } catch (error) {
            throw new AppError(500, "Failed to get escrow");
        }
    }

    async updateEscrow(id: string, data: any): Promise<any> {
        try {
            return await this.prisma.escrow.update({ where: { id }, data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to update escrow");
        }
    }
}

export default EscrowRepository;
