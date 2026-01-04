import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import FileService from "./file.service";

export const uploadFile = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        if (!request.file) {
            response.status(400).json({ status: "fail", message: "No file uploaded" });
            return;
        }

        const fileData = {
            filename: request.file.filename,
            originalName: request.file.originalname,
            path: request.file.path,
            size: request.file.size,
            mimetype: request.file.mimetype,
            uploadedBy: (request as any).user?.userId || "unknown",
        };

        await FileService.saveFileRecord(fileData);

        response.status(201).json({
            status: "success",
            data: {
                filename: request.file.filename,
                path: request.file.path,
                size: request.file.size,
            },
        });
    }
);

export const uploadMultipleFiles = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const files = request.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            response.status(400).json({ status: "fail", message: "No files uploaded" });
            return;
        }

        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                const fileData = {
                    filename: file.filename,
                    originalName: file.originalname,
                    path: file.path,
                    size: file.size,
                    mimetype: file.mimetype,
                    uploadedBy: (request as any).user?.userId || "unknown",
                };

                await FileService.saveFileRecord(fileData);

                return {
                    filename: file.filename,
                    path: file.path,
                    size: file.size,
                };
            })
        );

        response.status(201).json({
            status: "success",
            data: { files: uploadedFiles },
        });
    }
);

export const getAllFiles = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const files = await FileService.getAllFiles();
        response.status(200).json({ status: "success", data: { files } });
    }
);

export const deleteFile = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        await FileService.deleteFile(request.params.id, next);
        response.status(204).json({ status: "success", data: null });
    }
);
