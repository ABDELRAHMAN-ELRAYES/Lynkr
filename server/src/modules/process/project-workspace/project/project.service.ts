import { NextFunction } from "express";
import AppError from "../../../../utils/app-error";
import ProjectRepository from "./project.repository";
import EscrowRepository from "../../money-system/escrow/escrow.repository";
import { ICreateProjectData } from "./types/IProject";

class ProjectService {
    private static projectRepo = ProjectRepository.getInstance();
    private static escrowRepo = EscrowRepository.getInstance();

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

    static async markProjectComplete(projectId: string, providerProfileId: string, next: NextFunction) {
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

            return await this.projectRepo.updateProject(projectId, {
                status: "COMPLETED",
                completedAt: new Date()
            });
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

            return await this.projectRepo.updateProject(projectId, {
                status: "CANCELLED"
            });
        } catch (error) {
            return next(new AppError(500, "Failed to cancel project"));
        }
    }
}

export default ProjectService;
