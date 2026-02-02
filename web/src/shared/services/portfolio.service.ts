import axios from 'axios';
import type { PortfolioProject, CreatePortfolioProjectData, UpdatePortfolioProjectData } from '../types/portfolio';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class PortfolioService {
    // Create a new portfolio project
    async createProject(data: CreatePortfolioProjectData): Promise<PortfolioProject> {
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

        const response = await axios.post(`${API_BASE_URL}/provider/portfolio`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });

        return response.data.data.project;
    }

    // Get all projects for authenticated provider
    async getMyProjects(): Promise<PortfolioProject[]> {
        const response = await axios.get(`${API_BASE_URL}/provider/portfolio`, {
            withCredentials: true,
        });

        return response.data.data.projects;
    }

    // Get public projects for a provider (client view)
    async getPublicProjects(profileId: string): Promise<PortfolioProject[]> {
        const response = await axios.get(`${API_BASE_URL}/provider/portfolio/profile/${profileId}`);

        return response.data.data.projects;
    }

    // Get a single project by ID
    async getProjectById(projectId: string): Promise<PortfolioProject> {
        const response = await axios.get(`${API_BASE_URL}/provider/portfolio/${projectId}`, {
            withCredentials: true,
        });

        return response.data.data.project;
    }

    // Get a public project by ID (for client view)
    async getPublicProjectById(profileId: string, projectId: string): Promise<PortfolioProject> {
        const response = await axios.get(`${API_BASE_URL}/provider/portfolio/profile/${profileId}/project/${projectId}`);

        return response.data.data.project;
    }

    // Update a project
    async updateProject(projectId: string, data: UpdatePortfolioProjectData): Promise<PortfolioProject> {
        const requestData: any = { ...data };
        if (data.tags) {
            requestData.tags = JSON.stringify(data.tags);
        }

        const response = await axios.patch(`${API_BASE_URL}/provider/portfolio/${projectId}`, requestData, {
            withCredentials: true,
        });

        return response.data.data.project;
    }

    // Delete a project
    async deleteProject(projectId: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/provider/portfolio/${projectId}`, {
            withCredentials: true,
        });
    }

    // Toggle project privacy
    async togglePrivacy(projectId: string, isPublic: boolean): Promise<PortfolioProject> {
        const response = await axios.patch(
            `${API_BASE_URL}/provider/portfolio/${projectId}/privacy`,
            { isPublic },
            { withCredentials: true }
        );

        return response.data.data.project;
    }

    // Add an image to a project
    async addProjectImage(projectId: string, image: File, order?: number): Promise<any> {
        const formData = new FormData();
        formData.append('image', image);
        if (order !== undefined) formData.append('order', String(order));

        const response = await axios.post(
            `${API_BASE_URL}/provider/portfolio/${projectId}/images`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            }
        );

        return response.data.data.image;
    }

    // Remove an image from a project
    async removeProjectImage(projectId: string, imageId: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/provider/portfolio/${projectId}/images/${imageId}`, {
            withCredentials: true,
        });
    }
}

export const portfolioService = new PortfolioService();
