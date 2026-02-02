import { Router } from "express";
import { deleteAvailability, getMyAvailabilities, getProviderAvailabilities, saveAvailabilities } from "./availability.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { checkPermissions } from "../auth/auth.controller";
import { UserRole } from "@/enum/UserRole";

const router: Router = Router();

// Protected routes (requires authentication)
router.use(AuthMiddleware.protect, checkPermissions([UserRole.PROVIDER, UserRole.SUSPENDED_PROVIDER, UserRole.ADMIN, UserRole.SUPER_ADMIN]),);

// Save all availabilities (bulk replace)
router.post("/", saveAvailabilities);

// Get authenticated provider's own availabilities
router.get("/my", getMyAvailabilities);

/// Get a provider's public availabilities by provider profile id
router.get("/provider/:providerProfileId", getProviderAvailabilities);

// Delete a specific availability
router.delete("/:id", deleteAvailability);

export default router;
