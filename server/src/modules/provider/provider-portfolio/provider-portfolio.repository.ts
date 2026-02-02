import { PrismaClient } from "@prisma/client";
import { ICreatePortfolioProjectData, IUpdatePortfolioProjectData, IAddProjectImageData } from "./types/IProviderPortfolio";

class ProviderPortfolioRepository {
    private static instance: ProviderPortfolioRepository;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = new PrismaClient();
    }

    public static getInstance(): ProviderPortfolioRepository {
        if (!ProviderPortfolioRepository.instance) {
            ProviderPortfolioRepository.instance = new ProviderPortfolioRepository();
        }
        return ProviderPortfolioRepository.instance;
    }

    public getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    // Create a new portfolio project
    async createProject(providerProfileId: string, data: ICreatePortfolioProjectData) {
        // Create the project first
        const project = await this.prisma.providerPortfolioProject.create({
            data: {
                providerProfileId,
                name: data.name,
                description: data.description,
                projectLink: data.projectLink,
                isPublic: data.isPublic ?? true,
            },
        });

        // Create file records and link images
        if (data.images && data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                const imageData = data.images[i];

                // Create file record
                const file = await this.prisma.file.create({
                    data: {
                        filename: imageData.filename,
                        path: imageData.path,
                        mimetype: imageData.mimetype,
                        size: imageData.size,
                    },
                });

                // Link to project
                await this.prisma.providerPortfolioProjectImage.create({
                    data: {
                        projectId: project.id,
                        fileId: file.id,
                        order: imageData.order ?? i,
                    },
                });
            }
        }

        // Create tags
        if (data.tags && data.tags.length > 0) {
            await this.prisma.providerPortfolioProjectTag.createMany({
                data: data.tags.map(tag => ({
                    projectId: project.id,
                    tag,
                })),
            });
        }

        // Return the complete project with relations
        return await this.getProjectById(project.id);
    }

    // Get all projects for a provider
    async getProjectsByProfileId(providerProfileId: string) {
        return await this.prisma.providerPortfolioProject.findMany({
            where: { providerProfileId },
            include: {
                images: {
                    include: {
                        file: true,
                    },
                    orderBy: { order: 'asc' },
                },
                tags: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Get public projects for a provider (for client view)
    async getPublicProjectsByProfileId(providerProfileId: string) {
        return await this.prisma.providerPortfolioProject.findMany({
            where: {
                providerProfileId,
                isPublic: true,
            },
            include: {
                images: {
                    include: {
                        file: true,
                    },
                    orderBy: { order: 'asc' },
                },
                tags: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Get a single project by ID
    async getProjectById(id: string) {
        return await this.prisma.providerPortfolioProject.findUnique({
            where: { id },
            include: {
                images: {
                    include: {
                        file: true,
                    },
                    orderBy: { order: 'asc' },
                },
                tags: true,
                providerProfile: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }

    // Get a public project by ID (for client view)
    async getPublicProjectById(id: string) {
        return await this.prisma.providerPortfolioProject.findFirst({
            where: {
                id,
                isPublic: true,
            },
            include: {
                images: {
                    include: {
                        file: true,
                    },
                    orderBy: { order: 'asc' },
                },
                tags: true,
                providerProfile: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
    }

    // Update a project
    async updateProject(id: string, data: IUpdatePortfolioProjectData) {
        // Update basic project info
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.description) updateData.description = data.description;
        if (data.projectLink !== undefined) updateData.projectLink = data.projectLink;
        if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;

        await this.prisma.providerPortfolioProject.update({
            where: { id },
            data: updateData,
        });

        // Update tags if provided
        if (data.tags !== undefined) {
            // Delete existing tags
            await this.prisma.providerPortfolioProjectTag.deleteMany({
                where: { projectId: id },
            });

            // Create new tags
            if (data.tags.length > 0) {
                await this.prisma.providerPortfolioProjectTag.createMany({
                    data: data.tags.map(tag => ({
                        projectId: id,
                        tag,
                    })),
                });
            }
        }

        return await this.getProjectById(id);
    }

    // Delete a project
    async deleteProject(id: string) {
        const project = await this.getProjectById(id);
        if (!project) {
            return null;
        }

        // Delete the project (will cascade delete images and tags)
        await this.prisma.providerPortfolioProject.delete({
            where: { id },
        });

        // Delete the file records
        for (const image of project.images) {
            await this.prisma.file.delete({
                where: { id: image.fileId },
            });
        }

        return project;
    }

    // Add an image to a project
    async addProjectImage(projectId: string, data: IAddProjectImageData) {
        // Create file record
        const file = await this.prisma.file.create({
            data: {
                filename: data.file.filename,
                path: data.file.path,
                mimetype: data.file.mimetype,
                size: data.file.size,
            },
        });

        // Get current image count to set order
        const imageCount = await this.prisma.providerPortfolioProjectImage.count({
            where: { projectId },
        });

        // Link to project
        return await this.prisma.providerPortfolioProjectImage.create({
            data: {
                projectId,
                fileId: file.id,
                order: data.order ?? imageCount,
            },
            include: {
                file: true,
            },
        });
    }

    // Remove an image from a project
    async removeProjectImage(imageId: string) {
        const image = await this.prisma.providerPortfolioProjectImage.findUnique({
            where: { id: imageId },
        });

        if (!image) {
            return null;
        }

        // Delete the image link
        await this.prisma.providerPortfolioProjectImage.delete({
            where: { id: imageId },
        });

        // Delete the file record
        await this.prisma.file.delete({
            where: { id: image.fileId },
        });

        return image;
    }

    // Toggle project privacy
    async togglePrivacy(id: string, isPublic: boolean) {
        return await this.prisma.providerPortfolioProject.update({
            where: { id },
            data: { isPublic },
            include: {
                images: {
                    include: {
                        file: true,
                    },
                    orderBy: { order: 'asc' },
                },
                tags: true,
            },
        });
    }
}

export default ProviderPortfolioRepository;
