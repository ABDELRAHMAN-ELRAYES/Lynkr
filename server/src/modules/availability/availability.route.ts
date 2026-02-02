import { Router } from "express";
import { deleteAvailability, getMyAvailabilities, getProviderAvailabilities, saveAvailabilities } from "./availability.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";

const router: Router = Router();

// Protected routes (requires authentication)
router.use(AuthMiddleware.protect);

// Save all availabilities (bulk replace)
router.post("/", saveAvailabilities);

// Get authenticated provider's own availabilities
router.get("/my", getMyAvailabilities);

// Get a specific provider's public availabilities
router.get("/provider/:providerId", getProviderAvailabilities);

// Delete a specific availability
router.delete("/:id", deleteAvailability);

export default router;
