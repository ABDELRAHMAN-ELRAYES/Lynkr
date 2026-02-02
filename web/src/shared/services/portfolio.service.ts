import { apiClient, apiFormClient } from './api-client';
import type { PortfolioProject, CreatePortfolioProjectData, UpdatePortfolioProjectData } from '../types/portfolio';

export const portfolioService = {
    // Create a new portfolio project
    createProject: async (data: CreatePortfolioProjectData): Promise<PortfolioProject> => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        if (data.projectLink) formData.append('projectLink', data.projectLink);
        formData.append('isPublic', String(data.isPublic ?? true));
        formData.append('tags', JSON.stringify(data.tags));

        // Add all images
        data.images.forEach((image) => {
            formData.append('images', image);
        });

        const response = await apiFormClient({
            url: '/provider/portfolio',
            options: {
                method: 'POST',
            },
            formData,
        });

        return response.data.project;
    },

    // Get all projects for authenticated provider
    getMyProjects: async (): Promise<PortfolioProject[]> => {
        const response = await apiClient({
            url: '/provider/portfolio',
            options: {
                method: 'GET',
            },
        });

        return response.data.projects;
    },

    // Get public projects for a provider (client view)
    getPublicProjects: async (profileId: string): Promise<PortfolioProject[]> => {
        const response = await apiClient({
            url: `/provider/portfolio/profile/${profileId}`,
            options: {
                method: 'GET',
            },
        });

        return response.data.projects;
    },

    // Get a single project by ID
    getProjectById: async (projectId: string): Promise<PortfolioProject> => {
        const response = await apiClient({
            url: `/provider/portfolio/${projectId}`,
            options: {
                method: 'GET',
            },
        });

        return response.data.project;
    },

    // Get a public project by ID (for client view)
    getPublicProjectById: async (profileId: string, projectId: string): Promise<PortfolioProject> => {
        const response = await apiClient({
            url: `/provider/portfolio/profile/${profileId}/project/${projectId}`,
            options: {
                method: 'GET',
            },
        });

        return response.data.project;
    },
    // Update a project
    updateProject: async (projectId: string, data: UpdatePortfolioProjectData): Promise<PortfolioProject> => {
        const requestData: any = { ...data };
        if (data.tags) {
            requestData.tags = JSON.stringify(data.tags);
        }

        const response = await apiClient({
            url: `/provider/portfolio/${projectId}`,
            options: {
                method: 'PATCH',
                body: JSON.stringify(requestData),
            },
        });

        return response.data.project;
    },

    // Delete a project
    deleteProject: async (projectId: string): Promise<void> => {
        await apiClient({
            url: `/provider/portfolio/${projectId}`,
            options: {
                method: 'DELETE',
            },
        });
    },

    // Toggle project privacy
    togglePrivacy: async (projectId: string, isPublic: boolean): Promise<PortfolioProject> => {
        const response = await apiClient({
            url: `/provider/portfolio/${projectId}/privacy`,
            options: {
                method: 'PATCH',
                body: JSON.stringify({ isPublic }),
            },
        });

        return response.data.project;
    },

    // Add an image to a project
    addProjectImage: async (projectId: string, image: File, order?: number): Promise<any> => {
        const formData = new FormData();
        formData.append('image', image);
        if (order !== undefined) formData.append('order', String(order));

        const response = await apiFormClient({
            url: `/provider/portfolio/${projectId}/images`,
            options: {
                method: 'POST',
            },
            formData,
        });

        return response.data.image;
    },

    // Remove an image from a project
    removeProjectImage: async (projectId: string, imageId: string): Promise<void> => {
        apiClient({
            url: `/provider/portfolio/${projectId}/images/${imageId}`,
            options: {
                method: 'DELETE',
            },
        });
    }
}

