import { Router } from "express";
import {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    cancelRequest,
    acceptRequest,
    rejectRequest,
} from "./request.controller";
import upload from "../../../middlewares/file-upload";
import { compressImages } from "../../../middlewares/compress-image";
import { protect } from "../../auth/auth.controller";

const RequestRouter: Router = Router();

RequestRouter.use(protect);

RequestRouter.post(
    "/",
    upload.array("files"),
    compressImages,
    createRequest
);

RequestRouter.get("/", getRequests);

// Specific routes MUST come before the generic :id route to avoid route conflicts
// Using explicit route patterns to ensure they match before :id
RequestRouter.post("/:id/cancel", cancelRequest);
RequestRouter.post("/:id/accept", acceptRequest);
RequestRouter.post("/:id/reject", rejectRequest);

// Generic routes come after specific ones
RequestRouter.get("/:id", getRequestById);

RequestRouter.put(
    "/:id",
    upload.array("files"),
    compressImages,
    updateRequest
);

export default RequestRouter;
