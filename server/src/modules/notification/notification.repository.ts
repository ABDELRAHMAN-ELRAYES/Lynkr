import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";
import { ICreateNotificationData, INotificationQueryParams } from "./types/INotification";

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

    // ===== CREATE OPERATIONS =====

    async createNotification(data: ICreateNotificationData) {
        try {
            return await this.prisma.notification.create({
                data: {
                    userId: data.userId,
                    title: data.title,
                    message: data.message,
                    type: data.type,
                    category: data.category || "SYSTEM",
                    entityId: data.entityId,
                    entityType: data.entityType
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create notification");
        }
    }

    // ===== READ OPERATIONS =====

    async getUserNotifications(userId: string, params: INotificationQueryParams = {}) {
        const { page = 1, limit = 20, isRead, type, category } = params;
        const skip = (page - 1) * limit;

        const where: any = { userId };

        if (isRead !== undefined) {
            where.isRead = isRead;
        }
        if (type) {
            where.type = type;
        }
        if (category) {
            where.category = category;
        }

        try {
            const [notifications, total] = await Promise.all([
                this.prisma.notification.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: "desc" }
                }),
                this.prisma.notification.count({ where })
            ]);

            return {
                notifications,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw new AppError(500, "Failed to get notifications");
        }
    }

    async getNotificationById(id: string) {
        try {
            return await this.prisma.notification.findUnique({
                where: { id }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get notification");
        }
    }

    async getUnreadCount(userId: string) {
        try {
            return await this.prisma.notification.count({
                where: {
                    userId,
                    isRead: false
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get unread count");
        }
    }

    // ===== UPDATE OPERATIONS =====

    async markAsRead(id: string) {
        try {
            return await this.prisma.notification.update({
                where: { id },
                data: { isRead: true }
            });
        } catch (error) {
            throw new AppError(500, "Failed to mark notification as read");
        }
    }

    async markAllAsRead(userId: string) {
        try {
            return await this.prisma.notification.updateMany({
                where: {
                    userId,
                    isRead: false
                },
                data: { isRead: true }
            });
        } catch (error) {
            throw new AppError(500, "Failed to mark all notifications as read");
        }
    }

    // ===== DELETE OPERATIONS =====

    async deleteNotification(id: string) {
        try {
            return await this.prisma.notification.delete({
                where: { id }
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete notification");
        }
    }

    async deleteOldNotifications(userId: string, daysOld: number = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        try {
            return await this.prisma.notification.deleteMany({
                where: {
                    userId,
                    createdAt: { lt: cutoffDate },
                    isRead: true
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete old notifications");
        }
    }
}

export default NotificationRepository;
