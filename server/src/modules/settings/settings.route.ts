import { Router } from "express";
import {
    getSettings,
    updateSettings,
} from "./settings.controller";
import { UserRole } from "../../enum/UserRole";
import { protect, checkPermissions } from "../auth/auth.controller";

const SettingsRouter:Router = Router();

// Public route - anyone can read settings (e.g., commission rate)
SettingsRouter.get("/", getSettings);

// Admin-only route for updating settings
SettingsRouter.put(
    "/",
    protect,
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    updateSettings
);

export default SettingsRouter;
