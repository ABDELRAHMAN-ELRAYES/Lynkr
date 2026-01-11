import { NextFunction } from "express";
import AppError from "../../../../utils/app-error";
import ProjectRepository from "./project.repository";
import EscrowRepository from "../../money-system/escrow/escrow.repository";
import { ICreateProjectData } from "./types/IProject";


class ProjectService {
    private static projectRepo = ProjectRepository.getInstance();
    private static escrowRepo = EscrowRepository.getInstance();

    // ===== Helper: Check project access =====
    private static async checkProjectAccess(projectId: string, userId: string, providerProfileId?: string) {
        const project = await this.projectRepo.getProjectById(projectId);
        if (!project) return null;

        const isClient = project.clientId === userId;
        const isProvider = providerProfileId && project.providerProfileId === providerProfileId;

        if (!isClient && !isProvider) return null;
        return project;
    }

    static async createProjectFromProposal(
        clientId: string,
        providerProfileId: string,
        proposalId: string,
        totalPrice: number,
        next: NextFunction
    ) {
        try {
            // Check if project already exists for this proposal
            const existingProject = await this.projectRepo.getProjectByProposalId(proposalId);
            if (existingProject) {
                return next(new AppError(400, "Project already exists for this proposal"));
            }

            // Create project
            const projectData: ICreateProjectData = {
                clientId,
                providerProfileId,
                acceptedProposalId: proposalId,
                totalPrice
            };

            const project = await this.projectRepo.createProject(projectData);

            // Create escrow for this project
            await this.escrowRepo.createEscrow({
                projectId: project.id,
                depositAmount: totalPrice
            });

            // Fetch project with escrow
            return await this.projectRepo.getProjectById(project.id);
        } catch (error) {
            return next(new AppError(500, "Failed to create project"));
        }
    }

    static async getProjectById(projectId: string, next: NextFunction) {
        try {
            const project = await this.projectRepo.getProjectById(projectId);
            if (!project) {
                return next(new AppError(404, "Project not found"));
            }
            return project;
        } catch (error) {
            return next(new AppError(500, "Failed to get project"));
        }
    }

    static async getClientProjects(clientId: string, next: NextFunction) {
        try {
            return await this.projectRepo.getProjectsByClientId(clientId);
        } catch (error) {
            return next(new AppError(500, "Failed to get projects"));
        }
    }

    static async getProviderProjects(providerProfileId: string, next: NextFunction) {
        try {
            return await this.projectRepo.getProjectsByProviderId(providerProfileId);
        } catch (error) {
            return next(new AppError(500, "Failed to get projects"));
        }
    }

    static async markProjectComplete(projectId: string, userId: string, providerProfileId: string, next: NextFunction) {
        try {
            const project = await this.projectRepo.getProjectById(projectId);
            if (!project) {
                return next(new AppError(404, "Project not found"));
            }

            if (project.providerProfileId !== providerProfileId) {
                return next(new AppError(403, "You are not authorized to mark this project as complete"));
            }

            if (project.status !== "IN_PROGRESS") {
                return next(new AppError(400, "Project must be in progress to mark as complete"));
            }

            const updatedProject = await this.projectRepo.updateProject(projectId, {
                status: "COMPLETED",
                completedAt: new Date()
            });

            // Log activity
            await this.projectRepo.logActivity({
                projectId,
                userId,
                action: "COMPLETION_REQUESTED",
                details: "Provider marked project as completed"
            });

            return updatedProject;
        } catch (error) {
            return next(new AppError(500, "Failed to mark project as complete"));
        }
    }

    static async confirmProjectComplete(projectId: string, clientId: string, next: NextFunction) {
        try {
            const project = await this.projectRepo.getProjectById(projectId);
            if (!project) {
                return next(new AppError(404, "Project not found"));
            }

            if (project.clientId !== clientId) {
                return next(new AppError(403, "You are not authorized to confirm this project"));
            }

            if (project.status !== "COMPLETED") {
                return next(new AppError(400, "Project must be completed by provider first"));
            }

            // Release escrow funds to provider
            if (project.escrow) {
                await this.escrowRepo.releaseEscrow(project.escrow.id, project.providerProfileId);
            }

            // Log activity
            await this.projectRepo.logActivity({
                projectId,
                userId: clientId,
                action: "COMPLETION_CONFIRMED",
                details: "Client confirmed project completion. Funds released."
            });

            return project;
        } catch (error) {
            return next(new AppError(500, "Failed to confirm project completion"));
        }
    }

    static async cancelProject(projectId: string, clientId: string, next: NextFunction) {
        try {
            const project = await this.projectRepo.getProjectById(projectId);
            if (!project) {
                return next(new AppError(404, "Project not found"));
            }

            if (project.clientId !== clientId) {
                return next(new AppError(403, "You are not authorized to cancel this project"));
            }

            if (project.status === "COMPLETED") {
                return next(new AppError(400, "Cannot cancel a completed project"));
            }

            // Refund escrow if funds are still held
            if (project.escrow && project.escrow.status === "HOLDING") {
                await this.escrowRepo.refundEscrow(project.escrow.id);
            }

            const updatedProject = await this.projectRepo.updateProject(projectId, {
                status: "CANCELLED"
            });

            // Log activity
            await this.projectRepo.logActivity({
                projectId,
                userId: clientId,
                action: "PROJECT_CANCELLED",
                details: "Client cancelled the project"
            });

            return updatedProject;
        } catch (error) {
            return next(new AppError(500, "Failed to cancel project"));
        }
    }

    // ===== PROJECT FILES =====

    static async uploadProjectFile(
        projectId: string,
        fileId: string,
        uploaderId: string,
        providerProfileId: string | undefined,
        description: string | undefined,
        next: NextFunction
    ) {
        try {
            const project = await this.checkProjectAccess(projectId, uploaderId, providerProfileId);
            if (!project) {
                return next(new AppError(403, "You don't have access to this project"));
            }

            if (project.status === "CANCELLED" || project.status === "COMPLETED") {
                return next(new AppError(400, "Cannot upload files to a closed project"));
            }

            const projectFile = await this.projectRepo.addProjectFile({
                projectId,
                fileId,
                uploaderId,
                description
            });

            // Log activity
            await this.projectRepo.logActivity({
                projectId,
                userId: uploaderId,
                action: "FILE_UPLOADED",
                details: `Uploaded file: ${projectFile.file.filename}`
            });

            return projectFile;
        } catch (error) {
            return next(new AppError(500, "Failed to upload file to project"));
        }
    }

    static async getProjectFiles(projectId: string, userId: string, providerProfileId: string | undefined, next: NextFunction) {
        try {
            const project = await this.checkProjectAccess(projectId, userId, providerProfileId);
            if (!project) {
                return next(new AppError(403, "You don't have access to this project"));
            }

            return await this.projectRepo.getProjectFiles(projectId);
        } catch (error) {
            return next(new AppError(500, "Failed to get project files"));
        }
    }

    static async deleteProjectFile(projectFileId: string, userId: string, next: NextFunction) {
        try {
            const projectFile = await this.projectRepo.getProjectFileById(projectFileId);
            if (!projectFile) {
                return next(new AppError(404, "Project file not found"));
            }

            // Only uploader can delete
            if (projectFile.uploaderId !== userId) {
                return next(new AppError(403, "You can only delete files you uploaded"));
            }

            await this.projectRepo.deleteProjectFile(projectFileId);

            // Log activity
            await this.projectRepo.logActivity({
                projectId: projectFile.projectId,
                userId,
                action: "FILE_DELETED",
                details: `Deleted file: ${projectFile.file.filename}`
            });

            return { message: "File deleted successfully" };
        } catch (error) {
            return next(new AppError(500, "Failed to delete project file"));
        }
    }

    // ===== PROJECT ACTIVITIES =====

    static async getProjectActivities(projectId: string, userId: string, providerProfileId: string | undefined, next: NextFunction) {
        try {
            const project = await this.checkProjectAccess(projectId, userId, providerProfileId);
            if (!project) {
                return next(new AppError(403, "You don't have access to this project"));
            }

            return await this.projectRepo.getProjectActivities(projectId);
        } catch (error) {
            return next(new AppError(500, "Failed to get project activities"));
        }
    }
}

export default ProjectService;

