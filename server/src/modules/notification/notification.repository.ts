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

    async createNotification(data: any): Promise<any> {
        try {
            return await this.prisma.notification.create({ data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to create notification");
        }
    }

    async getUserNotifications(userId: string): Promise<any[]> {
        try {
            return await this.prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get notifications");
        }
    }

    async markAsRead(id: string): Promise<any> {
        try {
            return await this.prisma.notification.update({
                where: { id },
                data: { read: true } as any,
            });
        } catch (error) {
            throw new AppError(500, "Failed to mark notification as read");
        }
    }

    async deleteNotification(id: string): Promise<any> {
        try {
            return await this.prisma.notification.delete({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to delete notification");
        }
    }
}

export default NotificationRepository;
