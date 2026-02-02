import { apiClient, apiFormClient } from './api-client';
import type { ProviderDocument, CreateDocumentData, UpdateDocumentData, DocumentType } from '../types/portfolio';

export const documentService = {
    // Create a new document
    createDocument: async (data: CreateDocumentData): Promise<ProviderDocument> => {
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        formData.append('documentType', data.documentType);
        formData.append('file', data.file);
        formData.append('isPublic', String(data.isPublic ?? false));

        const response = await apiFormClient({
            url: '/provider/documents',
            options: {
                method: 'POST',
            },
            formData,
        });

        return response.data.document;
    }
    ,
    // Get all documents for authenticated provider
    getMyDocuments: async (): Promise<ProviderDocument[]> => {
        const response = await apiClient({
            url: '/provider/documents',
            options: {
                method: 'GET',
            },
        });

        return response.data.documents;
    }
    ,
    // Get public documents for a provider (client view)
    getPublicDocuments: async (profileId: string): Promise<ProviderDocument[]> => {
        const response = await apiClient({
            url: `/provider/documents/profile/${profileId}`,
            options: {
                method: 'GET',
            },
        });

        return response.data.documents;
    }
    ,
    // Get a single document by ID
    getDocumentById: async (documentId: string): Promise<ProviderDocument> => {
        const response = await apiClient({
            url: `/provider/documents/${documentId}`,
            options: {
                method: 'GET',
            },
        });

        return response.data.document;
    }
    ,
    // Update a document
    updateDocument: async (documentId: string, data: UpdateDocumentData): Promise<ProviderDocument> => {
        const response = await apiClient({
            url: `/provider/documents/${documentId}`,
            options: {
                method: 'PATCH',
                body: JSON.stringify(data),
            },
        });

        return response.data.document;
    }
    ,
    // Delete a document
    deleteDocument: async (documentId: string): Promise<void> => {
        await apiClient({
            url: `/provider/documents/${documentId}`,
            options: {
                method: 'DELETE',
            },
        });
    }
    ,
    // Toggle document privacy
    togglePrivacy: async (documentId: string, isPublic: boolean): Promise<ProviderDocument> => {
        const response = await apiClient({
            url: `/provider/documents/${documentId}/privacy`,
            options: {
                method: 'PATCH',
                body: JSON.stringify({ isPublic }),
            },
        });

        return response.data.document;
    }
    ,
    // Helper to get document type display name
    getDocumentTypeLabel: (type: DocumentType): string => {
        const labels: Record<DocumentType, string> = {
            RESUME: 'Resume',
            CERTIFICATE: 'Certificate',
            LICENSE: 'License',
            OTHER: 'Other',
        };
        return labels[type] || 'Document';
    }
}

