import PrismaClientSingleton from "../../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../../utils/app-error";
import { ICreateProjectData, IUpdateProjectData } from "./types/IProject";

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
                    payments: true
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
}

export default ProjectRepository;
