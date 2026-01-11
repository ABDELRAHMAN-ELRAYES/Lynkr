import { Router } from "express";
import {
    getAllSettings,
    getSetting,
    updateSetting,
} from "./settings.controller";
import { UserRole } from "../../enum/UserRole";
import { protect, checkPermissions } from "../auth/auth.controller";

const SettingsRouter = Router();

// All settings routes require admin access
SettingsRouter.use(protect, checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]));

SettingsRouter.route("/")
    .get(getAllSettings);

SettingsRouter.route("/:id")
    .get(getSetting)
    .put(updateSetting);

export default SettingsRouter;
