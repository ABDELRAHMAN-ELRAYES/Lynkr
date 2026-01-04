import NotificationRepository from "./notification.repository";
import { NextFunction } from "express";

class NotificationService {
    private static repository = NotificationRepository.getInstance();

    static async createNotification(data: any) {
        return await this.repository.createNotification(data);
    }

    static async getUserNotifications(userId: string) {
        return await this.repository.getUserNotifications(userId);
    }

    static async markAsRead(id: string, next: NextFunction) {
        return await this.repository.markAsRead(id);
    }

    static async deleteNotification(id: string, next: NextFunction) {
        return await this.repository.deleteNotification(id);
    }
}

export default NotificationService;
