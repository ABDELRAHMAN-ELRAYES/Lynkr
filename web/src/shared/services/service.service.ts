import { apiClient } from './api-client';

// Types for Services and Skills
export interface Service {
    id: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    skills?: Skill[];
}

export interface Skill {
    id: string;
    name: string;
    serviceId: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreateServiceData {
    name: string;
    description?: string;
}

export interface UpdateServiceData {
    name?: string;
    description?: string;
    isActive?: boolean;
}

export interface CreateSkillData {
    name: string;
}

// Service API
export const serviceService = {
    // Get all services
    getAllServices: async (includeInactive = false): Promise<Service[]> => {
        const data = await apiClient({
            url: `/services${includeInactive ? '?includeInactive=true' : ''}`,
            options: { method: 'GET' },
        });
        return data.data?.services || data.services || [];
    },

    // Get service by ID
    getServiceById: async (id: string): Promise<Service> => {
        const data = await apiClient({
            url: `/services/${id}`,
            options: { method: 'GET' },
        });
        return data.data?.service || data.service || data;
    },

    // Create service (admin)
    createService: async (payload: CreateServiceData): Promise<Service> => {
        const data = await apiClient({
            url: '/services',
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return data.data?.service || data.service || data;
    },

    // Update service (admin)
    updateService: async (id: string, payload: UpdateServiceData): Promise<Service> => {
        const data = await apiClient({
            url: `/services/${id}`,
            options: {
                method: 'PATCH',
                body: JSON.stringify(payload),
            },
        });
        return data.data?.service || data.service || data;
    },

    // Delete/Deactivate service (admin)
    deleteService: async (id: string): Promise<void> => {
        await apiClient({
            url: `/services/${id}`,
            options: { method: 'DELETE' },
        });
    },

    // Get skills for a service
    getSkillsByService: async (serviceId: string): Promise<Skill[]> => {
        const data = await apiClient({
            url: `/services/${serviceId}/skills`,
            options: { method: 'GET' },
        });
        return data.data?.skills || data.skills || [];
    },

    // Create skill for a service (admin)
    createSkill: async (serviceId: string, payload: CreateSkillData): Promise<Skill> => {
        const data = await apiClient({
            url: `/services/${serviceId}/skills`,
            options: {
                method: 'POST',
                body: JSON.stringify(payload),
            },
        });
        return data.data?.skill || data.skill || data;
    },

    // Delete skill (admin)
    deleteSkill: async (serviceId: string, skillId: string): Promise<void> => {
        await apiClient({
            url: `/services/${serviceId}/skills/${skillId}`,
            options: { method: 'DELETE' },
        });
    },
};
