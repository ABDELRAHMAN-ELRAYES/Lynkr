import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import NotificationService from "./notification.service";

export const getUserNotifications = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const userId = (request as any).user?.userId;
        const notifications = await NotificationService.getUserNotifications(userId);
        response.status(200).json({ status: "success", data: { notifications } });
    }
);

export const markNotificationAsRead = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const notification = await NotificationService.markAsRead(request.params.id, next);
        response.status(200).json({ status: "success", data: { notification } });
    }
);

export const deleteNotification = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        await NotificationService.deleteNotification(request.params.id, next);
        response.status(204).json({ status: "success", data: null });
    }
);
