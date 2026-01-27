import { apiClient, apiFormClient } from '@/shared/services/api-client';
import type {
    Project,
    ProjectFile,
    ProjectActivity,
} from '@/shared/types/project';

export const projectService = {
    /**
     * Get all projects for the current user (client or provider)
     */
    getMyProjects: async (): Promise<Project[]> => {
        const response = await apiClient({
            url: '/projects/me',
            options: { method: 'GET' },
        });
        return response.data;
    },

    /**
     * Get a specific project by ID
     */
    getProjectById: async (id: string): Promise<Project> => {
        const response = await apiClient({
            url: `/projects/${id}`,
            options: { method: 'GET' },
        });
        return response.data;
    },

    /**
     * Provider marks project as complete
     */
    markProjectComplete: async (id: string): Promise<Project> => {
        const response = await apiClient({
            url: `/projects/${id}/complete`,
            options: { method: 'PATCH' },
        });
        return response.data;
    },

    /**
     * Client confirms project completion (triggers escrow release)
     */
    confirmProjectComplete: async (id: string): Promise<Project> => {
        const response = await apiClient({
            url: `/projects/${id}/confirm`,
            options: { method: 'PATCH' },
        });
        return response.data;
    },

    /**
     * Client cancels project
     */
    cancelProject: async (id: string): Promise<Project> => {
        const response = await apiClient({
            url: `/projects/${id}/cancel`,
            options: { method: 'PATCH' },
        });
        return response.data;
    },

    // ===== PROJECT FILES =====

    /**
     * Upload a file to a project
     */
    uploadProjectFile: async (
        projectId: string,
        file: File,
        description?: string
    ): Promise<ProjectFile> => {
        const formData = new FormData();
        formData.append('file', file);
        if (description) {
            formData.append('description', description);
        }
        const response = await apiFormClient({
            url: `/projects/${projectId}/files`,
            options: { method: 'POST' },
            formData,
        });
        return response.data;
    },

    /**
     * Get all files for a project
     */
    getProjectFiles: async (projectId: string): Promise<ProjectFile[]> => {
        const response = await apiClient({
            url: `/projects/${projectId}/files`,
            options: { method: 'GET' },
        });
        return response.data;
    },

    /**
     * Delete a project file
     */
    deleteProjectFile: async (
        projectId: string,
        fileId: string
    ): Promise<void> => {
        await apiClient({
            url: `/projects/${projectId}/files/${fileId}`,
            options: { method: 'DELETE' },
        });
    },

    // ===== PROJECT ACTIVITIES =====

    /**
     * Get activity timeline for a project
     */
    getProjectActivities: async (
        projectId: string
    ): Promise<ProjectActivity[]> => {
        const response = await apiClient({
            url: `/projects/${projectId}/activities`,
            options: { method: 'GET' },
        });
        return response.data;
    },
};
