import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";

class NotificationRepository {
    private prisma: PrismaClient;
    static instance: NotificationRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): NotificationRepository {
        if (!NotificationRepository.instance) {
            NotificationRepository.instance = new NotificationRepository();
        }
        return NotificationRepository.instance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    // TODO: Add Notification model to Prisma schema
    async createNotification(_data: object): Promise<object> {
        throw new AppError(501, "Notification module not implemented");
    }

    async getUserNotifications(_userId: string): Promise<object[]> {
        throw new AppError(501, "Notification module not implemented");
    }

    async markAsRead(_id: string): Promise<object> {
        throw new AppError(501, "Notification module not implemented");
    }

    async deleteNotification(_id: string): Promise<object> {
        throw new AppError(501, "Notification module not implemented");
    }
}

export default NotificationRepository;
