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

    async getDashboardStats(): Promise<object> {
        try {
            const [totalUsers, totalProjects, totalPayments] = await Promise.all([
                this.prisma.user.count(),
                this.prisma.project.count(),
                this.prisma.payment.count(),
            ]);

            return {
                totalUsers,
                totalProjects,
                totalPayments,
            };
        } catch (error) {
            throw new AppError(500, "Failed to get dashboard stats");
        }
    }

    async getAllUsers(): Promise<object[]> {
        try {
            return await this.prisma.user.findMany();
        } catch (error) {
            throw new AppError(500, "Failed to get users");
        }
    }
}

export default AdminRepository;
