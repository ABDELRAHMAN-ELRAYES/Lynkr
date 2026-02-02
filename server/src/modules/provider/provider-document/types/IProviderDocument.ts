export interface IProviderDocument {
    id: string;
    providerProfileId: string;
    title: string;
    description?: string;
    documentType: DocumentType;
    fileId: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export enum DocumentType {
    RESUME = 'RESUME',
    CERTIFICATE = 'CERTIFICATE',
    LICENSE = 'LICENSE',
    OTHER = 'OTHER'
}

export interface ICreateDocumentData {
    title: string;
    description?: string;
    documentType: DocumentType;
    file: {
        filename: string;
        path: string;
        mimetype: string;
        size: number;
    };
    isPublic?: boolean;
}

export interface IUpdateDocumentData {
    title?: string;
    description?: string;
    documentType?: DocumentType;
    isPublic?: boolean;
}
