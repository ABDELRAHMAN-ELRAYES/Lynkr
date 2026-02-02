import axios from 'axios';
import type { ProviderDocument, CreateDocumentData, UpdateDocumentData, DocumentType } from '../types/portfolio';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class DocumentService {
    // Create a new document
    async createDocument(data: CreateDocumentData): Promise<ProviderDocument> {
        const formData = new FormData();
        formData.append('title', data.title);
        if (data.description) formData.append('description', data.description);
        formData.append('documentType', data.documentType);
        formData.append('file', data.file);
        formData.append('isPublic', String(data.isPublic ?? false));

        const response = await axios.post(`${API_BASE_URL}/provider/documents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });

        return response.data.data.document;
    }

    // Get all documents for authenticated provider
    async getMyDocuments(): Promise<ProviderDocument[]> {
        const response = await axios.get(`${API_BASE_URL}/provider/documents`, {
            withCredentials: true,
        });

        return response.data.data.documents;
    }

    // Get public documents for a provider (client view)
    async getPublicDocuments(profileId: string): Promise<ProviderDocument[]> {
        const response = await axios.get(`${API_BASE_URL}/provider/documents/profile/${profileId}`);

        return response.data.data.documents;
    }

    // Get a single document by ID
    async getDocumentById(documentId: string): Promise<ProviderDocument> {
        const response = await axios.get(`${API_BASE_URL}/provider/documents/${documentId}`, {
            withCredentials: true,
        });

        return response.data.data.document;
    }

    // Update a document
    async updateDocument(documentId: string, data: UpdateDocumentData): Promise<ProviderDocument> {
        const response = await axios.patch(`${API_BASE_URL}/provider/documents/${documentId}`, data, {
            withCredentials: true,
        });

        return response.data.data.document;
    }

    // Delete a document
    async deleteDocument(documentId: string): Promise<void> {
        await axios.delete(`${API_BASE_URL}/provider/documents/${documentId}`, {
            withCredentials: true,
        });
    }

    // Toggle document privacy
    async togglePrivacy(documentId: string, isPublic: boolean): Promise<ProviderDocument> {
        const response = await axios.patch(
            `${API_BASE_URL}/provider/documents/${documentId}/privacy`,
            { isPublic },
            { withCredentials: true }
        );

        return response.data.data.document;
    }

    // Helper to get document type display name
    getDocumentTypeLabel(type: DocumentType): string {
        const labels: Record<DocumentType, string> = {
            RESUME: 'Resume',
            CERTIFICATE: 'Certificate',
            LICENSE: 'License',
            OTHER: 'Other',
        };
        return labels[type] || 'Document';
    }

    // Helper to generate file download URL
    getFileUrl(filePath: string): string {
        return `${API_BASE_URL.replace('/api', '')}/api/uploads/${filePath.split('/').pop()}`;
    }
}

export const documentService = new DocumentService();
