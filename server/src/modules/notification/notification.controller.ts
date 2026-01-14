import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import NotificationService from "./notification.service";

// Get user notifications with pagination
export const getUserNotifications = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const userId = (request.user as any).id;
        const { page, limit, isRead, type, category } = request.query;

        const params = {
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 20,
            isRead: isRead !== undefined ? isRead === "true" : undefined,
            type: type as any,
            category: category as any
        };

        const result = await NotificationService.getUserNotifications(userId, params);

        response.status(200).json({
            status: "success",
            data: result
        });
    }
);

// Get unread notification count
export const getUnreadCount = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const userId = (request.user as any).id;
        const result = await NotificationService.getUnreadCount(userId);

        response.status(200).json({
            status: "success",
            data: result
        });
    }
);

// Mark single notification as read
export const markNotificationAsRead = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const userId = (request.user as any).id;
        const notification = await NotificationService.markAsRead(
            request.params.id,
            userId,
            next
        );

        if (!notification) return;

        response.status(200).json({
            status: "success",
            data: { notification }
        });
    }
);

// Mark all notifications as read
export const markAllAsRead = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const userId = (request.user as any).id;
        const result = await NotificationService.markAllAsRead(userId);

        response.status(200).json({
            status: "success",
            message: `${result.count} notifications marked as read`
        });
    }
);

// Delete notification
export const deleteNotification = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const userId = (request.user as any).id;
        await NotificationService.deleteNotification(request.params.id, userId, next);

        response.status(204).json({
            status: "success",
            data: null
        });
    }
);
