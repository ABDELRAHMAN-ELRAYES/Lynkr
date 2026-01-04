import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";

class AdminRepository {
    private prisma: PrismaClient;
    static instance: AdminRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): AdminRepository {
        if (!AdminRepository.instance) {
            AdminRepository.instance = new AdminRepository();
        }
        return AdminRepository.instance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    async getDashboardStats(): Promise<any> {
        try {
            const [totalUsers, totalOperations, totalTransactions] = await Promise.all([
                this.prisma.user.count(),
                this.prisma.operation.count(),
                this.prisma.transaction.count(),
            ]);

            return {
                totalUsers,
                totalOperations,
                totalTransactions,
            };
        } catch (error) {
            throw new AppError(500, "Failed to get dashboard stats");
        }
    }

    async getAllUsers(): Promise<any[]> {
        try {
            return await this.prisma.user.findMany();
        } catch (error) {
            throw new AppError(500, "Failed to get users");
        }
    }
}

export default AdminRepository;
