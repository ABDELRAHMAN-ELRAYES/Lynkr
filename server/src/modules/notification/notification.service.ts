import NotificationRepository from "./notification.repository";
import UserRepository from "../user/user.repository";
import SocketService from "../../services/socket.service";
import Email from "../../utils/email/email";
import config from "../../config/config";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";
import {
    ICreateNotificationData,
    INotificationQueryParams,
    getDefaultCategory
} from "./types/INotification";

// Critical notification types that should also send email
const CRITICAL_TYPES = ["PAYMENT", "SYSTEM"];

class NotificationService {
    private static repository = NotificationRepository.getInstance();
    private static userRepository = UserRepository.getInstance();
    private static socketService = SocketService.getInstance();

    // ===== CREATE NOTIFICATION =====

    static async createNotification(data: {
        userId: string;
        title: string;
        message: string;
        type?: string;
        entityId?: string;
        entityType?: string;
        sendEmail?: boolean;
    }) {
        // Use MESSAGE as default type for backward compatibility with messaging module
        const notificationType = (data.type || "MESSAGE") as any;
        const category = getDefaultCategory(notificationType);

        const notificationData: ICreateNotificationData = {
            userId: data.userId,
            title: data.title,
            message: data.message,
            type: notificationType,
            category,
            entityId: data.entityId,
            entityType: data.entityType as any
        };

        const notification = await this.repository.createNotification(notificationData);

        // Real-time: Send notification to user via Socket.IO
        this.broadcastNotification(data.userId, notification);

        // Email: Send for critical notifications or if explicitly requested
        const shouldSendEmail = data.sendEmail || CRITICAL_TYPES.includes(notificationType);
        if (shouldSendEmail) {
            await this.sendEmailNotification(data.userId, data.title, data.message);
        }

        return notification;
    }

    private static broadcastNotification(userId: string, notification: any) {
        try {
            this.socketService.sendNotification(userId, notification);
        } catch (error) {
            console.error("Failed to broadcast notification:", error);
        }
    }

    private static async sendEmailNotification(userId: string, title: string, message: string) {
        try {
            const user = await this.userRepository.getUserById(userId);
            if (user?.email) {
                const email = new Email(config.mail.from || "noreply@lynkr.com", user.email);
                await email.send("notification", title, { title, message, name: user.firstName });
            }
        } catch (error) {
            console.error("Failed to send email notification:", error);
            // Don't fail the notification if email fails
        }
    }

    // ===== GET NOTIFICATIONS =====

    static async getUserNotifications(
        userId: string,
        params: INotificationQueryParams = {}
    ) {
        return await this.repository.getUserNotifications(userId, params);
    }

    static async getUnreadCount(userId: string) {
        const count = await this.repository.getUnreadCount(userId);
        return { count };
    }

    // ===== MARK AS READ =====

    static async markAsRead(id: string, userId: string, next: NextFunction) {
        const notification = await this.repository.getNotificationById(id);

        if (!notification) {
            return next(new AppError(404, "Notification not found"));
        }

        // Verify ownership
        if (notification.userId !== userId) {
            return next(new AppError(403, "You can only mark your own notifications as read"));
        }

        return await this.repository.markAsRead(id);
    }

    static async markAllAsRead(userId: string) {
        return await this.repository.markAllAsRead(userId);
    }

    // ===== DELETE NOTIFICATION =====

    static async deleteNotification(id: string, userId: string, next: NextFunction) {
        const notification = await this.repository.getNotificationById(id);

        if (!notification) {
            return next(new AppError(404, "Notification not found"));
        }

        // Verify ownership
        if (notification.userId !== userId) {
            return next(new AppError(403, "You can only delete your own notifications"));
        }

        return await this.repository.deleteNotification(id);
    }

    // ===== HELPER: SEND SPECIFIC NOTIFICATION TYPES =====

    static async sendProposalNotification(
        userId: string,
        title: string,
        message: string,
        proposalId: string
    ) {
        return await this.createNotification({
            userId,
            title,
            message,
            type: "PROPOSAL",
            entityId: proposalId,
            entityType: "PROPOSAL"
        });
    }

    static async sendProjectNotification(
        userId: string,
        title: string,
        message: string,
        projectId: string
    ) {
        return await this.createNotification({
            userId,
            title,
            message,
            type: "PROJECT",
            entityId: projectId,
            entityType: "PROJECT"
        });
    }

    static async sendPaymentNotification(
        userId: string,
        title: string,
        message: string,
        paymentId?: string
    ) {
        return await this.createNotification({
            userId,
            title,
            message,
            type: "PAYMENT",
            entityId: paymentId,
            entityType: "PAYMENT"
        });
    }

    static async sendReviewNotification(
        userId: string,
        title: string,
        message: string,
        reviewId: string
    ) {
        return await this.createNotification({
            userId,
            title,
            message,
            type: "REVIEW",
            entityId: reviewId,
            entityType: "REVIEW"
        });
    }

    static async sendSessionNotification(
        userId: string,
        title: string,
        message: string,
        sessionId: string
    ) {
        return await this.createNotification({
            userId,
            title,
            message,
            type: "SESSION",
            entityId: sessionId,
            entityType: "SESSION"
        });
    }

    static async sendSystemNotification(
        userId: string,
        title: string,
        message: string
    ) {
        return await this.createNotification({
            userId,
            title,
            message,
            type: "SYSTEM"
        });
    }
}

export default NotificationService;
