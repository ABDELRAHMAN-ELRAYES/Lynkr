import { Router } from "express";
import {
    createProject,
    getMyProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addProjectImage,
    removeProjectImage,
    toggleProjectPrivacy,
    getPublicProjectsByProfileId,
    getPublicProjectById,
} from "./provider-portfolio.controller";
import { protect, checkPermissions } from "../../auth/auth.controller";
import { UserRole } from "../../../enum/UserRole";
import upload from "@/middlewares/file-upload";
import { compressImages } from "@/middlewares/compress-image";

const ProviderPortfolioRouter: Router = Router();

// Public routes - Get public projects for a provider (client view)
ProviderPortfolioRouter.get("/profile/:profileId", getPublicProjectsByProfileId);
ProviderPortfolioRouter.get("/profile/:profileId/project/:projectId", getPublicProjectById);

// Protected routes - Providers can manage their own portfolio
ProviderPortfolioRouter.post(
    "/",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    upload.array("images", 5), // Max 5 images
    compressImages, // Compress uploaded images
    createProject
);

ProviderPortfolioRouter.get(
    "/",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    getMyProjects
);

ProviderPortfolioRouter.get(
    "/:id",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    getProjectById
);

ProviderPortfolioRouter.patch(
    "/:id",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    updateProject
);

ProviderPortfolioRouter.delete(
    "/:id",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    deleteProject
);

ProviderPortfolioRouter.post(
    "/:id/images",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    upload.single("image"),
    compressImages, // Compress uploaded image
    addProjectImage
);

ProviderPortfolioRouter.delete(
    "/:id/images/:imageId",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    removeProjectImage
);

ProviderPortfolioRouter.patch(
    "/:id/privacy",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    toggleProjectPrivacy
);

export default ProviderPortfolioRouter;

