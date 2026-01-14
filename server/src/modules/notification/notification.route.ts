import { Router } from "express";
import {
    getUserNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllAsRead,
    deleteNotification,
} from "./notification.controller";
import { protect } from "../auth/auth.controller";

const NotificationRouter = Router();

// All routes require authentication
NotificationRouter.use(protect);

// GET /api/v1/notifications - Get user notifications (paginated)
NotificationRouter.get("/", getUserNotifications);

// GET /api/v1/notifications/unread-count - Get unread notification count
NotificationRouter.get("/unread-count", getUnreadCount);

// PATCH /api/v1/notifications/read-all - Mark all as read
NotificationRouter.patch("/read-all", markAllAsRead);

// PATCH /api/v1/notifications/:id/read - Mark single as read
NotificationRouter.patch("/:id/read", markNotificationAsRead);

// DELETE /api/v1/notifications/:id - Delete notification
NotificationRouter.delete("/:id", deleteNotification);

export default NotificationRouter;
