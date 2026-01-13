import { Router } from "express";
import {
    createProject,
    getProject,
    getMyProjects,
    markComplete,
    confirmComplete,
    cancelProject,
    uploadProjectFile,
    getProjectFiles,
    deleteProjectFile,
    getProjectActivities
} from "./project.controller";
import { AuthMiddleware } from "../../../middlewares/auth.middleware";
import upload, { validateUploadedFileSize } from "../../../../middlewares/file-upload";

const ProjectRouter = Router();

// All routes require authentication
ProjectRouter.use(AuthMiddleware.protect);

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

// ===== PROJECT FILES =====

// Upload file to project
ProjectRouter.post(
    "/:id/files",
    upload.single("file"),
    validateUploadedFileSize,
    uploadProjectFile
);

// List project files
ProjectRouter.get("/:id/files", getProjectFiles);

// Delete project file
ProjectRouter.delete("/:id/files/:fileId", deleteProjectFile);

// ===== PROJECT ACTIVITIES =====

// Get project activity timeline
ProjectRouter.get("/:id/activities", getProjectActivities);

export default ProjectRouter;

