import { NextFunction } from "express";
import AppError from "../../../utils/app-error";
import ProviderPortfolioRepository from "./provider-portfolio.repository";
import { ICreatePortfolioProjectData, IUpdatePortfolioProjectData, IAddProjectImageData } from "./types/IProviderPortfolio";
import ProfileRepository from "../profile/profile.repository";

class ProviderPortfolioService {
    private static portfolioRepo = ProviderPortfolioRepository.getInstance();
    private static profileRepo = ProfileRepository.getInstance();

    // Create a new portfolio project
    static async createProject(userId: string, data: ICreatePortfolioProjectData, next: NextFunction) {
        try {
            // Get provider profile
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (!profile) {
                return next(new AppError(404, "Provider profile not found"));
            }

            // Validate image count (1-5 images)
            if (!data.images || data.images.length === 0) {
                return next(new AppError(400, "At least one image is required"));
            }
            if (data.images.length > 5) {
                return next(new AppError(400, "Maximum of 5 images allowed per project"));
            }

            return await this.portfolioRepo.createProject(profile.id, data);
        } catch (error) {
            console.error("Error creating project:", error);
            return next(new AppError(500, "Failed to create project"));
        }
    }

    // Get all projects for authenticated provider
    static async getMyProjects(userId: string, next: NextFunction) {
        try {
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (!profile) {
                return next(new AppError(404, "Provider profile not found"));
            }

            return await this.portfolioRepo.getProjectsByProfileId(profile.id);
        } catch (error) {
            console.error("Error fetching projects:", error);
            return next(new AppError(500, "Failed to fetch projects"));
        }
    }

    // Get public projects for a provider (client view)
    static async getPublicProjects(profileId: string, next: NextFunction) {
        try {
            return await this.portfolioRepo.getPublicProjectsByProfileId(profileId);
        } catch (error) {
            console.error("Error fetching public projects:", error);
            return next(new AppError(500, "Failed to fetch projects"));
        }
    }

    // Get a single project
    static async getProjectById(id: string, userId: string | undefined, next: NextFunction) {
        try {
            const project = await this.portfolioRepo.getProjectById(id);
            if (!project) {
                return next(new AppError(404, "Project not found"));
            }

            // If user is authenticated, check if they own the project
            if (userId) {
                const profile = await this.profileRepo.getProviderProfileByUserId(userId);
                if (profile && project.providerProfileId === profile.id) {
                    return project;
                }
            }

            // If not owner, only return if public
            if (!project.isPublic) {
                return next(new AppError(403, "You don't have access to this project"));
            }

            return project;
        } catch (error) {
            console.error("Error fetching project:", error);
            return next(new AppError(500, "Failed to fetch project"));
        }
    }

    // Get a public project by ID (for client view)
    static async getPublicProjectById(projectId: string, next: NextFunction) {
        try {
            const project = await this.portfolioRepo.getPublicProjectById(projectId);
            if (!project) {
                return next(new AppError(404, "Project not found or not public"));
            }

            return project;
        } catch (error) {
            console.error("Error fetching project:", error);
            return next(new AppError(500, "Failed to fetch project"));
        }
    }

    // Update a project
    static async updateProject(id: string, userId: string, data: IUpdatePortfolioProjectData, next: NextFunction) {
        try {
            const project = await this.portfolioRepo.getProjectById(id);
            if (!project) {
                return next(new AppError(404, "Project not found"));
            }

            // Check ownership
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (!profile || project.providerProfileId !== profile.id) {
                return next(new AppError(403, "You don't have permission to update this project"));
            }

            return await this.portfolioRepo.updateProject(id, data);
        } catch (error) {
            console.error("Error updating project:", error);
            return next(new AppError(500, "Failed to update project"));
        }
    }

    // Delete a project
    static async deleteProject(id: string, userId: string, next: NextFunction) {
        try {
            const project = await this.portfolioRepo.getProjectById(id);
            if (!project) {
                return next(new AppError(404, "Project not found"));
            }

            // Check ownership
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (!profile || project.providerProfileId !== profile.id) {
                return next(new AppError(403, "You don't have permission to delete this project"));
            }

            await this.portfolioRepo.deleteProject(id);
            return { message: "Project deleted successfully" };
        } catch (error) {
            console.error("Error deleting project:", error);
            return next(new AppError(500, "Failed to delete project"));
        }
    }

    // Add an image to a project
    static async addProjectImage(projectId: string, userId: string, data: IAddProjectImageData, next: NextFunction) {
        try {
            const project = await this.portfolioRepo.getProjectById(projectId);
            if (!project) {
                return next(new AppError(404, "Project not found"));
            }

            // Check ownership
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (!profile || project.providerProfileId !== profile.id) {
                return next(new AppError(403, "You don't have permission to modify this project"));
            }

            // Check image count (max 5)
            if (project.images.length >= 5) {
                return next(new AppError(400, "Maximum of 5 images allowed per project"));
            }

            return await this.portfolioRepo.addProjectImage(projectId, data);
        } catch (error) {
            console.error("Error adding image:", error);
            return next(new AppError(500, "Failed to add image"));
        }
    }

    // Remove an image from a project
    static async removeProjectImage(projectId: string, imageId: string, userId: string, next: NextFunction) {
        try {
            const project = await this.portfolioRepo.getProjectById(projectId);
            if (!project) {
                return next(new AppError(404, "Project not found"));
            }

            // Check ownership
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (!profile || project.providerProfileId !== profile.id) {
                return next(new AppError(403, "You don't have permission to modify this project"));
            }

            // Check if image belongs to this project
            const imageExists = project.images.some(img => img.id === imageId);
            if (!imageExists) {
                return next(new AppError(404, "Image not found in this project"));
            }

            // Don't allow removing the last image
            if (project.images.length === 1) {
                return next(new AppError(400, "Cannot remove the last image. Projects must have at least one image."));
            }

            await this.portfolioRepo.removeProjectImage(imageId);
            return { message: "Image removed successfully" };
        } catch (error) {
            console.error("Error removing image:", error);
            return next(new AppError(500, "Failed to remove image"));
        }
    }

    // Toggle project privacy
    static async togglePrivacy(id: string, userId: string, isPublic: boolean, next: NextFunction) {
        try {
            const project = await this.portfolioRepo.getProjectById(id);
            if (!project) {
                return next(new AppError(404, "Project not found"));
            }

            // Check ownership
            const profile = await this.profileRepo.getProviderProfileByUserId(userId);
            if (!profile || project.providerProfileId !== profile.id) {
                return next(new AppError(403, "You don't have permission to modify this project"));
            }

            return await this.portfolioRepo.togglePrivacy(id, isPublic);
        } catch (error) {
            console.error("Error toggling project privacy:", error);
            return next(new AppError(500, "Failed to update project privacy"));
        }
    }
}

export default ProviderPortfolioService;
