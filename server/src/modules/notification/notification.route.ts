import { Router } from "express";
import {
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification,
} from "./notification.controller";
import { protect } from "../../middlewares/auth.middleware";

const NotificationRouter = Router();

NotificationRouter.get("/", protect, getUserNotifications);
NotificationRouter.patch("/:id/read", protect, markNotificationAsRead);
NotificationRouter.delete("/:id", protect, deleteNotification);

export default NotificationRouter;
