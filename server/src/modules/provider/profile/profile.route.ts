import { Router } from "express";
import {
    createProviderProfile,
    getProviderProfileByUserId,
    getProviderProfileById,
    getAllProviderProfiles,
    updateProviderProfile,
    approveProviderProfile,
    rejectProviderProfile,
    deleteProviderProfile,
} from "./profile.controller";
import { protect, checkPermissions } from "../../auth/auth.controller";
import { UserRole } from "../../../enum/UserRole";

const ProfileRouter = Router();

// Public routes (approved profiles only)
ProfileRouter.get("/", getAllProviderProfiles);
ProfileRouter.get("/:id", getProviderProfileById);

// Protected routes - Providers can manage their own profiles
ProfileRouter.post(
    "/",
    protect,
    checkPermissions([UserRole.PROVIDER_PENDING, UserRole.PROVIDER_APPROVED]),
    createProviderProfile
);

ProfileRouter.put(
    "/:id",
    protect,
    checkPermissions([UserRole.PROVIDER_PENDING, UserRole.PROVIDER_APPROVED]),
    updateProviderProfile
);

ProfileRouter.get(
    "/user/:userId",
    protect,
    getProviderProfileByUserId
);

// Admin-only routes
ProfileRouter.post(
    "/:id/approve",
    protect,
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    approveProviderProfile
);

ProfileRouter.post(
    "/:id/reject",
    protect,
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    rejectProviderProfile
);

ProfileRouter.delete(
    "/:id",
    protect,
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    deleteProviderProfile
);

export default ProfileRouter;
