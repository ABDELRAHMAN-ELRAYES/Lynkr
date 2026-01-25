import { apiClient, apiFormClient } from './api-client';
import type {
    Proposal,
    CreateProposalPayload,
    UpdateProposalPayload,
} from '@/shared/types/request';

// ============================================
// Proposal Service - API Integration Layer
// ============================================

export const proposalService = {
    /**
     * Submit a proposal for a request
     */
    createProposal: async (payload: CreateProposalPayload): Promise<Proposal> => {
        const formData = new FormData();

        // Add files if provided
        if (payload.files && payload.files.length > 0) {
            payload.files.forEach((file) => {
                formData.append('files', file);
            });
        }

        // Add proposal data
        formData.append('requestId', payload.requestId);
        formData.append('price', String(payload.price));
        formData.append('priceType', payload.priceType);
        formData.append('estimatedDays', String(payload.estimatedDays));
        if (payload.notes) {
            formData.append('notes', payload.notes);
        }

        const data = await apiFormClient({
            url: '/proposals',
            options: { method: 'POST' },
            formData,
        });

        return data.data || data;
    },

    /**
     * Get all proposals for a specific request (Client only)
     */
    getProposalsByRequest: async (requestId: string): Promise<Proposal[]> => {
        const data = await apiClient({
            url: `/proposals/request/${requestId}`,
            options: { method: 'GET' },
        });
        return data.data || [];
    },

    /**
     * Get proposal by ID
     */
    getProposalById: async (id: string): Promise<Proposal> => {
        const data = await apiClient({
            url: `/proposals/${id}`,
            options: { method: 'GET' },
        });
        return data.data || data;
    },

    /**
     * Update proposal (before acceptance)
     */
    updateProposal: async (id: string, payload: UpdateProposalPayload): Promise<Proposal> => {
        const formData = new FormData();

        // Add files if provided
        if (payload.files && payload.files.length > 0) {
            payload.files.forEach((file) => {
                formData.append('files', file);
            });
        }

        // Add other fields
        if (payload.price !== undefined) {
            formData.append('price', String(payload.price));
        }
        if (payload.estimatedDays !== undefined) {
            formData.append('estimatedDays', String(payload.estimatedDays));
        }
        if (payload.notes !== undefined) {
            formData.append('notes', payload.notes);
        }

        const data = await apiFormClient({
            url: `/proposals/${id}`,
            options: { method: 'PUT' },
            formData,
        });

        return data.data || data;
    },

    /**
     * Client accepts a proposal (triggers Project creation)
     */
    acceptProposal: async (id: string): Promise<Proposal> => {
        const data = await apiClient({
            url: `/proposals/${id}/accept`,
            options: { method: 'PATCH' },
        });
        return data.data || data;
    },

    /**
     * Client rejects a proposal
     */
    rejectProposal: async (id: string): Promise<Proposal> => {
        const data = await apiClient({
            url: `/proposals/${id}/reject`,
            options: { method: 'PATCH' },
        });
        return data.data || data;
    },

    /**
     * Provider withdraws/deletes a proposal
     */
    deleteProposal: async (id: string): Promise<void> => {
        await apiClient({
            url: `/proposals/${id}`,
            options: { method: 'DELETE' },
        });
    },
};
