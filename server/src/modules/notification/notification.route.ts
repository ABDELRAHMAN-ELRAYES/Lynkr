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

// Get user notifications (paginated)
NotificationRouter.get("/", getUserNotifications);

// Get unread notification count
NotificationRouter.get("/unread-count", getUnreadCount);

// Mark all as read
NotificationRouter.patch("/read-all", markAllAsRead);

// Mark single as read
NotificationRouter.patch("/:id/read", markNotificationAsRead);

// Delete notification
NotificationRouter.delete("/:id", deleteNotification);

export default NotificationRouter;
