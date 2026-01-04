import { Router } from "express";
import {
    getAllSettings,
    getSetting,
    updateSetting,
} from "./settings.controller";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { UserRole } from "../../enum/UserRole";

const SettingsRouter = Router();

// All settings routes require admin access
SettingsRouter.use(protect, restrictTo(UserRole.ADMIN, UserRole.SUPER_ADMIN));

SettingsRouter.route("/")
    .get(getAllSettings);

SettingsRouter.route("/:id")
    .get(getSetting)
    .put(updateSetting);

export default SettingsRouter;
