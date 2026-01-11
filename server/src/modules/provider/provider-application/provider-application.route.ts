import { Router } from "express";
import {
    submitApplication,
    getMyApplications,
    getPendingApplications,
    getApplicationById,
    approveApplication,
    rejectApplication,
} from "./provider-application.controller";
import { protect } from "../../auth/auth.controller";
import { requireRole } from "../../../middlewares/middle-rbac";
import { UserRole } from "../../../enum/UserRole";

const ProviderApplicationRouter = Router();

ProviderApplicationRouter.use(protect);

// User routes
ProviderApplicationRouter.post("/", submitApplication);
ProviderApplicationRouter.get("/me", getMyApplications);

// Admin routes
ProviderApplicationRouter.get(
    "/",
    requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    getPendingApplications
);

ProviderApplicationRouter.get(
    "/:id",
    requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    getApplicationById
);

ProviderApplicationRouter.patch(
    "/:id/approve",
    requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    approveApplication
);

ProviderApplicationRouter.patch(
    "/:id/reject",
    requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    rejectApplication
);

export default ProviderApplicationRouter;
