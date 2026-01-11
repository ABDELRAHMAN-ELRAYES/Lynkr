import { Router } from "express";
import {
    uploadFile,
    uploadMultipleFiles,
    getAllFiles,
    deleteFile,
} from "./file.controller";
import upload from "../../middlewares/file-upload";
import { protect } from "../auth/auth.controller";

const FileRouter = Router();

FileRouter.post("/upload", protect, upload.single("file"), uploadFile);
FileRouter.post("/upload-multiple", protect, upload.array("files", 10), uploadMultipleFiles);
FileRouter.get("/", protect, getAllFiles);
FileRouter.delete("/:id", protect, deleteFile);

export default FileRouter;
