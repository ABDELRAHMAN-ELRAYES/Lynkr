import { NextFunction } from "express";
import AppError from "../../../utils/app-error";
import ProjectRepository from "./project.repository";
import EscrowRepository from "../money-system/escrow/escrow.repository";
import ConversationService from "../../messaging/conversation/conversation.service";
import ProfileRepository from "../../provider/profile/profile.repository";
import NotificationService from "../../notification/notification.service";
import { ICreateProjectData } from "./types/IProject";


class ProjectService {
    private static projectRepo = ProjectRepository.getInstance();
    private static escrowRepo = EscrowRepository.getInstance();
    private static profileRepo = ProfileRepository.getInstance();

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

        // Get provider's userId for conversation
        const providerProfile = await this.profileRepo.getProviderProfileById(providerProfileId);
        if (providerProfile) {
            // Create conversation for project communication
            await ConversationService.createConversation({
                projectId: project.id,
                participant1Id: clientId,
                participant2Id: providerProfile.userId
            }, next);
        }

        // Fetch project with escrow
        return await this.projectRepo.getProjectById(project.id);
    }

    // ===== Helper: Transform Project Data =====
    private static transformProject(project: any) {
        if (!project) return null;

        // Map request from acceptedProposal if available
        const request = project.acceptedProposal?.request;

        return {
            ...project,
            // Flatten functionality for frontend convenience
            title: request?.title || "Untitled Project",
            request: request,
            // Ensure we don't leak internal structure if not needed, 
            // but keeping it doesn't hurt.
        };
    }

    static async getProjectById(projectId: string, next: NextFunction) {
        const project = await this.projectRepo.getProjectById(projectId);
        if (!project) {
            return next(new AppError(404, "Project not found"));
        }
        return this.transformProject(project);
    }

    static async getClientProjects(clientId: string, _next: NextFunction) {
        const projects = await this.projectRepo.getProjectsByClientId(clientId);
        return projects.map(p => this.transformProject(p));
    }

    static async getProviderProjects(providerProfileId: string, _next: NextFunction) {
        const projects = await this.projectRepo.getProjectsByProviderId(providerProfileId);
        return projects.map(p => this.transformProject(p));
    }

    static async markProjectComplete(projectId: string, userId: string, providerProfileId: string, next: NextFunction) {
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

        // Notify client
        await NotificationService.sendProjectNotification(
            project.clientId,
            "Project Marked Complete",
            "The provider has marked your project as complete. Please review and confirm.",
            projectId
        );

        return updatedProject;
    }

    static async confirmProjectComplete(projectId: string, clientId: string, next: NextFunction) {
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

        // Notify provider
        const providerProfile = await this.profileRepo.getProviderProfileById(project.providerProfileId);
        if (providerProfile) {
            await NotificationService.sendProjectNotification(
                providerProfile.userId,
                "Project Completed!",
                "The client has confirmed completion. Funds have been released to your account.",
                projectId
            );
        }

        return project;
    }

    static async cancelProject(projectId: string, clientId: string, next: NextFunction) {
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

        // Notify provider
        const providerProfile = await this.profileRepo.getProviderProfileById(project.providerProfileId);
        if (providerProfile) {
            await NotificationService.sendProjectNotification(
                providerProfile.userId,
                "Project Cancelled",
                "The client has cancelled the project.",
                projectId
            );
        }

        return updatedProject;
    }

    // ===== PROJECT FILES =====

    static async uploadProjectFile(
        projectId: string,
        file: {
            filename: string;
            path: string;
            mimetype: string;
            size: number;
        },
        uploaderId: string,
        providerProfileId: string | undefined,
        description: string | undefined,
        next: NextFunction
    ) {
        const project = await this.checkProjectAccess(projectId, uploaderId, providerProfileId);
        if (!project) {
            return next(new AppError(403, "You don't have access to this project"));
        }

        if (project.status === "CANCELLED" || project.status === "COMPLETED") {
            return next(new AppError(400, "Cannot upload files to a closed project"));
        }

        const projectFile = await this.projectRepo.addProjectFile({
            projectId,
            file,
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

        // Notify other party
        const otherUserId = project.clientId === uploaderId
            ? (await this.profileRepo.getProviderProfileById(project.providerProfileId))?.userId
            : project.clientId;
        if (otherUserId) {
            await NotificationService.sendProjectNotification(
                otherUserId,
                "New File Uploaded",
                `A new file "${file.filename}" has been uploaded to the project.`,
                projectId
            );
        }

        return projectFile;
    }

    static async getProjectFiles(projectId: string, userId: string, providerProfileId: string | undefined, next: NextFunction) {
        const project = await this.checkProjectAccess(projectId, userId, providerProfileId);
        if (!project) {
            return next(new AppError(403, "You don't have access to this project"));
        }

        return await this.projectRepo.getProjectFiles(projectId);
    }

    static async deleteProjectFile(projectFileId: string, userId: string, next: NextFunction) {
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
    }

    // ===== PROJECT ACTIVITIES =====

    static async getProjectActivities(projectId: string, userId: string, providerProfileId: string | undefined, next: NextFunction) {
        const project = await this.checkProjectAccess(projectId, userId, providerProfileId);
        if (!project) {
            return next(new AppError(403, "You don't have access to this project"));
        }

        return await this.projectRepo.getProjectActivities(projectId);
    }
}

export default ProjectService;

