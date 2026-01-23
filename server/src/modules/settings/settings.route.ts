import { Router } from "express";
import {
    getAllSettings,
    getSetting,
    updateSetting,
} from "./settings.controller";
import { UserRole } from "../../enum/UserRole";
import { protect, checkPermissions } from "../auth/auth.controller";

const SettingsRouter = Router();

// Public route - anyone can read settings (e.g., commission rate)
SettingsRouter.get("/", getAllSettings);
SettingsRouter.get("/:id", getSetting);

// Admin-only routes for updating settings
SettingsRouter.put(
    "/:id",
    protect,
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    updateSetting
);

export default SettingsRouter;

