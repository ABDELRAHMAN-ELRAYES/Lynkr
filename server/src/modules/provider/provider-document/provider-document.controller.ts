import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../utils/catch-async";
import ProviderDocumentService from "./provider-document.service";
import { IUser } from "../../user/types/IUser";
import { DocumentType, ICreateDocumentData, IUpdateDocumentData } from "./types/IProviderDocument";

/**
 * Create a new document
 */
export const createDocument = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;
        const { title, description, documentType, isPublic } = request.body;

        // File should be uploaded via multer middleware
        const file = request.file;
        if (!file) {
            response.status(400).json({
                status: "fail",
                message: "No file uploaded",
            });
            return;
        }

        const data: ICreateDocumentData = {
            title,
            description,
            documentType: documentType as DocumentType,
            isPublic: isPublic === 'true' || isPublic === true,
            file: {
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size,
            },
        };

        const document = await ProviderDocumentService.createDocument(user.id, data, next);
        if (!document) return;

        response.status(201).json({
            status: "success",
            data: { document },
        });
    }
);

/**
 * Get all documents for authenticated provider
 */
export const getMyDocuments = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;

        const documents = await ProviderDocumentService.getMyDocuments(user.id, next);
        if (!documents) return;

        response.status(200).json({
            status: "success",
            data: { documents },
        });
    }
);

/**
 * Get a single document
 */
export const getDocumentById = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;
        const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;

        const document = await ProviderDocumentService.getDocumentById(id, user.id, next);
        if (!document) return;

        response.status(200).json({
            status: "success",
            data: { document },
        });
    }
);

/**
 * Update a document
 */
export const updateDocument = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;
        const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const data: IUpdateDocumentData = request.body;

        const document = await ProviderDocumentService.updateDocument(id, user.id, data, next);
        if (!document) return;

        response.status(200).json({
            status: "success",
            data: { document },
        });
    }
);

/**
 * Delete a document
 */
export const deleteDocument = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;
        const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;

        const result = await ProviderDocumentService.deleteDocument(id, user.id, next);
        if (!result) return;

        response.status(200).json({
            status: "success",
            message: result.message,
        });
    }
);

/**
 * Toggle document privacy
 */
export const toggleDocumentPrivacy = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;
        const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const { isPublic } = request.body;

        const document = await ProviderDocumentService.togglePrivacy(id, user.id, isPublic, next);
        if (!document) return;

        response.status(200).json({
            status: "success",
            data: { document },
        });
    }
);

/**
 * Get public documents for a provider (for profile/client view)
 */
export const getPublicDocumentsByProfileId = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const profileId = Array.isArray(request.params.profileId) ? request.params.profileId[0] : request.params.profileId;

        const documents = await ProviderDocumentService.getPublicDocuments(profileId, next);
        if (!documents) return;

        response.status(200).json({
            status: "success",
            data: { documents },
        });
    }
);
