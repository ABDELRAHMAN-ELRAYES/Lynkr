import { Router } from "express";
import {
    createProject,
    getProject,
    getMyProjects,
    markComplete,
    confirmComplete,
    cancelProject
} from "./project.controller";
import { protect } from "../../../auth/auth.controller";

const ProjectRouter = Router();

// All routes require authentication
ProjectRouter.use(protect);

// Create project from accepted proposal
ProjectRouter.post("/", createProject);

// Get user's projects (client or provider)
ProjectRouter.get("/me", getMyProjects);

// Get specific project
ProjectRouter.get("/:id", getProject);

// Provider marks project as complete
ProjectRouter.patch("/:id/complete", markComplete);

// Client confirms completion (triggers escrow release)
ProjectRouter.patch("/:id/confirm", confirmComplete);

// Client cancels project (triggers refund if applicable)
ProjectRouter.patch("/:id/cancel", cancelProject);

export default ProjectRouter;
