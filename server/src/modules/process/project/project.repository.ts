import PrismaClientSingleton from "../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../utils/app-error";
import { ICreateProjectData, IUpdateProjectData } from "./types/IProject";
import { ICreateProjectFileData, ICreateActivityData } from "./types/IProjectWorkspace";

class ProjectRepository {
    private prisma: PrismaClient;
    static instance: ProjectRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): ProjectRepository {
        if (!ProjectRepository.instance) {
            ProjectRepository.instance = new ProjectRepository();
        }
        return ProjectRepository.instance;
    }

    async createProject(data: ICreateProjectData) {
        try {
            return await this.prisma.project.create({
                data: {
                    clientId: data.clientId,
                    providerProfileId: data.providerProfileId,
                    acceptedProposalId: data.acceptedProposalId,
                    totalPrice: data.totalPrice,
                },
                include: {
                    client: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    },
                    providerProfile: {
                        select: {
                            id: true,
                            title: true,
                            user: { select: { id: true, firstName: true, lastName: true, email: true } }
                        }
                    },
                    escrow: true
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create project");
        }
    }

    async getProjectById(id: string) {
        try {
            return await this.prisma.project.findUnique({
                where: { id },
                include: {
                    client: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    },
                    providerProfile: {
                        select: {
                            id: true,
                            title: true,
                            user: { select: { id: true, firstName: true, lastName: true, email: true } }
                        }
                    },
                    acceptedProposal: true,
                    escrow: true,
                    projectPayments: {
                        include: {
                            payment: true
                        }
                    },
                    files: {
                        include: {
                            file: true,
                            uploader: { select: { id: true, firstName: true, lastName: true } }
                        },
                        orderBy: { createdAt: "desc" }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get project");
        }
    }

    async getProjectsByClientId(clientId: string) {
        try {
            return await this.prisma.project.findMany({
                where: { clientId },
                include: {
                    providerProfile: {
                        select: {
                            id: true,
                            title: true,
                            user: { select: { id: true, firstName: true, lastName: true } }
                        }
                    },
                    escrow: true
                },
                orderBy: { createdAt: "desc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get client projects");
        }
    }

    async getProjectsByProviderId(providerProfileId: string) {
        try {
            return await this.prisma.project.findMany({
                where: { providerProfileId },
                include: {
                    client: {
                        select: { id: true, firstName: true, lastName: true }
                    },
                    escrow: true
                },
                orderBy: { createdAt: "desc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get provider projects");
        }
    }

    async updateProject(id: string, data: IUpdateProjectData) {
        try {
            return await this.prisma.project.update({
                where: { id },
                data,
                include: {
                    client: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    },
                    providerProfile: {
                        select: {
                            id: true,
                            title: true,
                            user: { select: { id: true, firstName: true, lastName: true, email: true } }
                        }
                    },
                    escrow: true
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to update project");
        }
    }

    async getProjectByProposalId(proposalId: string) {
        try {
            return await this.prisma.project.findUnique({
                where: { acceptedProposalId: proposalId }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get project by proposal");
        }
    }

    // ===== PROJECT FILES =====

    async addProjectFile(data: ICreateProjectFileData) {
        try {
            return await this.prisma.projectFile.create({
                data: {
                    project: { connect: { id: data.projectId } },
                    file: {
                        create: {
                            filename: data.file.filename,
                            path: data.file.path,
                            mimetype: data.file.mimetype,
                            size: data.file.size
                        }
                    },
                    uploader: { connect: { id: data.uploaderId } },
                    description: data.description
                },
                include: {
                    file: true,
                    uploader: { select: { id: true, firstName: true, lastName: true } }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to add project file");
        }
    }

    async getProjectFiles(projectId: string) {
        try {
            return await this.prisma.projectFile.findMany({
                where: { projectId },
                include: {
                    file: true,
                    uploader: { select: { id: true, firstName: true, lastName: true } }
                },
                orderBy: { createdAt: "desc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get project files");
        }
    }

    async getProjectFileById(id: string) {
        try {
            return await this.prisma.projectFile.findUnique({
                where: { id },
                include: {
                    file: true,
                    uploader: { select: { id: true, firstName: true, lastName: true } },
                    project: true
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get project file");
        }
    }

    async deleteProjectFile(id: string) {
        try {
            return await this.prisma.projectFile.delete({
                where: { id }
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete project file");
        }
    }

    // ===== PROJECT ACTIVITIES =====

    async logActivity(data: ICreateActivityData) {
        try {
            return await this.prisma.projectActivity.create({
                data: {
                    projectId: data.projectId,
                    userId: data.userId,
                    action: data.action,
                    details: data.details
                },
                include: {
                    user: { select: { id: true, firstName: true, lastName: true } }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to log activity");
        }
    }

    async getProjectActivities(projectId: string) {
        try {
            return await this.prisma.projectActivity.findMany({
                where: { projectId },
                include: {
                    user: { select: { id: true, firstName: true, lastName: true } }
                },
                orderBy: { createdAt: "desc" }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get project activities");
        }
    }
}

export default ProjectRepository;

