// Portfolio Project types
export interface PortfolioProject {
    id: string;
    providerProfileId: string;
    name: string;
    description: string;
    projectLink?: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    images: PortfolioProjectImage[];
    tags: PortfolioProjectTag[];
    providerProfile?: {
        user: {
            id: string;
            firstName: string;
            lastName: string;
        };
    };
}

export interface PortfolioProjectImage {
    id: string;
    projectId: string;
    fileId: string;
    order: number;
    createdAt: string;
    file: {
        id: string;
        filename: string;
        path: string;
        mimetype: string;
        size: number;
    };
}

export interface PortfolioProjectTag {
    id: string;
    projectId: string;
    tag: string;
    createdAt: string;
}

export interface CreatePortfolioProjectData {
    name: string;
    description: string;
    projectLink?: string;
    isPublic?: boolean;
    tags: string[];
    images: File[];
}

export interface UpdatePortfolioProjectData {
    name?: string;
    description?: string;
    projectLink?: string;
    isPublic?: boolean;
    tags?: string[];
}

// Provider Document types
export enum DocumentType {
    RESUME = 'RESUME',
    CERTIFICATE = 'CERTIFICATE',
    LICENSE = 'LICENSE',
    OTHER = 'OTHER'
}

export interface ProviderDocument {
    id: string;
    providerProfileId: string;
    title: string;
    description?: string;
    documentType: DocumentType;
    fileId: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    file: {
        id: string;
        filename: string;
        path: string;
        mimetype: string;
        size: number;
    };
}

export interface CreateDocumentData {
    title: string;
    description?: string;
    documentType: DocumentType;
    file: File;
    isPublic?: boolean;
}

export interface UpdateDocumentData {
    title?: string;
    description?: string;
    documentType?: DocumentType;
    isPublic?: boolean;
}
