import { Router } from "express";
import {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    cancelRequest,
} from "./request.controller";
import upload from "../../middlewares/file-upload";
import { compressImages } from "../../middlewares/compress-image";
import { protect } from "../auth/auth.controller";

const RequestRouter = Router();

RequestRouter.use(protect);

RequestRouter.post(
    "/",
    upload.array("files"),
    compressImages,
    createRequest
);

RequestRouter.get("/", getRequests);
RequestRouter.get("/:id", getRequestById);

RequestRouter.put(
    "/:id",
    upload.array("files"),
    compressImages,
    updateRequest
);

RequestRouter.post(
    "/:id/cancel",
    // checkPermissions([UserRole.CLIENT]),
    cancelRequest
);

export default RequestRouter;
