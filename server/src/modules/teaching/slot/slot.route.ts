import { Router } from "express";
import SlotController from "./slot.controller";
import { AuthMiddleware } from "../../../middlewares/auth.middleware";
import { UserRole } from "../../../enum/UserRole";

const router = Router();

// All routes require authentication
router.use(AuthMiddleware.protect);

// Provider routes (approved providers only)
router.post("/", AuthMiddleware.checkPermissions([UserRole.PROVIDER_APPROVED]), SlotController.createSlot);
router.post("/bulk", AuthMiddleware.checkPermissions([UserRole.PROVIDER_APPROVED]), SlotController.createMultipleSlots);
router.get("/my", AuthMiddleware.checkPermissions([UserRole.PROVIDER_APPROVED]), SlotController.getMySlots);
router.patch("/:id", AuthMiddleware.checkPermissions([UserRole.PROVIDER_APPROVED]), SlotController.updateSlot);
router.delete("/:id", AuthMiddleware.checkPermissions([UserRole.PROVIDER_APPROVED]), SlotController.deleteSlot);

// Public routes (for students to view available slots)
router.get("/provider/:providerId", SlotController.getProviderSlots);
router.get("/:id", SlotController.getSlotById);

export default router;
