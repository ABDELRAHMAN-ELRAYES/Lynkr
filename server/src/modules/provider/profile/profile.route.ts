import { Router } from "express";
import {
    createProviderProfile,
    getProviderProfileByUserId,
    getProviderProfileById,
    getAllProviderProfiles,
    searchProviderProfiles,
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
ProfileRouter.get("/search", searchProviderProfiles);
ProfileRouter.get("/:id", getProviderProfileById);

// Protected routes - Providers can manage their own profiles
// Note: Supporting both PROVIDER_PENDING (backend enum) and PENDING_PROVIDER (frontend sends)
ProfileRouter.post(
    "/",
    protect,
    checkPermissions([UserRole.PROVIDER_PENDING, UserRole.PROVIDER_APPROVED, UserRole.PENDING_PROVIDER]),
    createProviderProfile
);

// /full route - alias for profile creation used by frontend during onboarding
ProfileRouter.post(
    "/full",
    protect,
    checkPermissions([UserRole.PROVIDER_PENDING, UserRole.PROVIDER_APPROVED, UserRole.PENDING_PROVIDER]),
    createProviderProfile
);

ProfileRouter.put(
    "/:id",
    protect,
    checkPermissions([UserRole.PROVIDER_PENDING, UserRole.PROVIDER_APPROVED, UserRole.PENDING_PROVIDER]),
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

