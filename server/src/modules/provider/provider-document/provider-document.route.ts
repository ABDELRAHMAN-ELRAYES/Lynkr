import { Router } from "express";
import {
    createDocument,
    getMyDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    toggleDocumentPrivacy,
    getPublicDocumentsByProfileId,
} from "./provider-document.controller";
import { protect, checkPermissions } from "../../auth/auth.controller";
import { UserRole } from "../../../enum/UserRole";
import upload from "@/middlewares/file-upload";

const ProviderDocumentRouter: Router = Router();

// Public route - Get public documents for a provider (client view)
ProviderDocumentRouter.get("/profile/:profileId", getPublicDocumentsByProfileId);

// Protected routes - Providers can manage their own documents
ProviderDocumentRouter.post(
    "/",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    upload.single("file"),
    createDocument
);

ProviderDocumentRouter.get(
    "/",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    getMyDocuments
);

ProviderDocumentRouter.get(
    "/:id",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    getDocumentById
);

ProviderDocumentRouter.patch(
    "/:id",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    updateDocument
);

ProviderDocumentRouter.delete(
    "/:id",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    deleteDocument
);

ProviderDocumentRouter.patch(
    "/:id/privacy",
    protect,
    checkPermissions([UserRole.PROVIDER, UserRole.PENDING_PROVIDER]),
    toggleDocumentPrivacy
);

export default ProviderDocumentRouter;
