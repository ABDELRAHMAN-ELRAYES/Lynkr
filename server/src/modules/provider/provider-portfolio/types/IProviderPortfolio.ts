export interface IProviderPortfolioProject {
    id: string;
    providerProfileId: string;
    name: string;
    description: string;
    projectLink?: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPortfolioProjectImage {
    id: string;
    projectId: string;
    fileId: string;
    order: number;
    createdAt: Date;
}

export interface IPortfolioProjectTag {
    id: string;
    projectId: string;
    tag: string;
    createdAt: Date;
}

export interface ICreatePortfolioProjectData {
    name: string;
    description: string;
    projectLink?: string;
    isPublic?: boolean;
    tags?: string[];
    images: {
        filename: string;
        path: string;
        mimetype: string;
        size: number;
        order?: number;
    }[];
}

export interface IUpdatePortfolioProjectData {
    name?: string;
    description?: string;
    projectLink?: string;
    isPublic?: boolean;
    tags?: string[];
}

export interface IAddProjectImageData {
    file: {
        filename: string;
        path: string;
        mimetype: string;
        size: number;
    };
    order?: number;
}
