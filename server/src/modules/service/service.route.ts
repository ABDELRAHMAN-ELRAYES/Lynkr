import { Router } from "express";
import {
    createService,
    getAllServices,
    getService,
    updateService,
    deleteService,
    getSkillsByService,
    createSkill,
    deleteSkill,
} from "./service.controller";
import { protect, checkPermissions } from "../auth/auth.controller";
import { UserRole } from "../../enum/UserRole";

const ServiceRouter = Router();

// Public: Get all services
ServiceRouter.get("/", getAllServices);

// Public: Get service by ID
ServiceRouter.get("/:id", getService);

// Public: Get skills for a service
ServiceRouter.get("/:id/skills", getSkillsByService);

// ===== Admin Routes =====
ServiceRouter.use(protect);

// Create service
ServiceRouter.post(
    "/",
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    createService
);

// Update service
ServiceRouter.patch(
    "/:id",
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    updateService
);

// Delete service
ServiceRouter.delete(
    "/:id",
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    deleteService
);

// Create skill for service
ServiceRouter.post(
    "/:id/skills",
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    createSkill
);

// Delete skill
ServiceRouter.delete(
    "/:id/skills/:skillId",
    checkPermissions([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    deleteSkill
);

export default ServiceRouter;
