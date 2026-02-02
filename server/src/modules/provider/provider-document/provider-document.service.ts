import { NextFunction } from "express";
import AppError from "../../../utils/app-error";
import ProviderDocumentRepository from "./provider-document.repository";
import { ICreateDocumentData, IUpdateDocumentData } from "./types/IProviderDocument";
import ProfileRepository from "../profile/profile.repository";

class ProviderDocumentService {
    private static documentRepo = ProviderDocumentRepository.getInstance();
    private static profileRepo = ProfileRepository.getInstance();

    // Create a new document
    static async createDocument(userId: string, data: ICreateDocumentData, next: NextFunction) {
        try {
            // Get provider profile
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (!profile) {
                return next(new AppError(404, "Provider profile not found"));
            }

            return await this.documentRepo.createDocument(profile.id, data);
        } catch (error) {
            console.error("Error creating document:", error);
            return next(new AppError(500, "Failed to create document"));
        }
    }

    // Get all documents for authenticated provider
    static async getMyDocuments(userId: string, next: NextFunction) {
        try {
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (!profile) {
                return next(new AppError(404, "Provider profile not found"));
            }

            return await this.documentRepo.getDocumentsByProfileId(profile.id);
        } catch (error) {
            console.error("Error fetching documents:", error);
            return next(new AppError(500, "Failed to fetch documents"));
        }
    }

    // Get public documents for a provider (client view)
    static async getPublicDocuments(profileId: string, next: NextFunction) {
        try {
            return await this.documentRepo.getPublicDocumentsByProfileId(profileId);
        } catch (error) {
            console.error("Error fetching public documents:", error);
            return next(new AppError(500, "Failed to fetch documents"));
        }
    }

    // Get a single document
    static async getDocumentById(id: string, userId: string, next: NextFunction) {
        try {
            const document = await this.documentRepo.getDocumentById(id);
            if (!document) {
                return next(new AppError(404, "Document not found"));
            }

            // Check if user owns this document
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (profile && document.providerProfileId === profile.id) {
                return document;
            }

            // If not owner, only return if public
            if (!document.isPublic) {
                return next(new AppError(403, "You don't have access to this document"));
            }

            return document;
        } catch (error) {
            console.error("Error fetching document:", error);
            return next(new AppError(500, "Failed to fetch document"));
        }
    }

    // Update a document
    static async updateDocument(id: string, userId: string, data: IUpdateDocumentData, next: NextFunction) {
        try {
            const document = await this.documentRepo.getDocumentById(id);
            if (!document) {
                return next(new AppError(404, "Document not found"));
            }

            // Check ownership
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (!profile || document.providerProfileId !== profile.id) {
                return next(new AppError(403, "You don't have permission to update this document"));
            }

            return await this.documentRepo.updateDocument(id, data);
        } catch (error) {
            console.error("Error updating document:", error);
            return next(new AppError(500, "Failed to update document"));
        }
    }

    // Delete a document
    static async deleteDocument(id: string, userId: string, next: NextFunction) {
        try {
            const document = await this.documentRepo.getDocumentById(id);
            if (!document) {
                return next(new AppError(404, "Document not found"));
            }

            // Check ownership
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (!profile || document.providerProfileId !== profile.id) {
                return next(new AppError(403, "You don't have permission to delete this document"));
            }

            await this.documentRepo.deleteDocument(id);
            return { message: "Document deleted successfully" };
        } catch (error) {
            console.error("Error deleting document:", error);
            return next(new AppError(500, "Failed to delete document"));
        }
    }

    // Toggle document privacy
    static async togglePrivacy(id: string, userId: string, isPublic: boolean, next: NextFunction) {
        try {
            const document = await this.documentRepo.getDocumentById(id);
            if (!document) {
                return next(new AppError(404, "Document not found"));
            }

            // Check ownership
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (!profile || document.providerProfileId !== profile.id) {
                return next(new AppError(403, "You don't have permission to modify this document"));
            }

            return await this.documentRepo.togglePrivacy(id, isPublic);
        } catch (error) {
            console.error("Error toggling document privacy:", error);
            return next(new AppError(500, "Failed to update document privacy"));
        }
    }
}

export default ProviderDocumentService;
