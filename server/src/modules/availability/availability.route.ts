import { Router } from "express";
import AvailabilityController from "./availability.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";

const router: Router = Router();
const availabilityController = AvailabilityController.getInstance();

// Protected routes (requires authentication)
router.use(AuthMiddleware.protect);

// Save all availabilities (bulk replace)
router.post("/", availabilityController.saveAvailabilities);

// Get authenticated provider's own availabilities
router.get("/my", availabilityController.getMyAvailabilities);

// Get a specific provider's public availabilities
router.get("/provider/:providerId", availabilityController.getProviderAvailabilities);

// Delete a specific availability
router.delete("/:id", availabilityController.deleteAvailability);

export default router;
