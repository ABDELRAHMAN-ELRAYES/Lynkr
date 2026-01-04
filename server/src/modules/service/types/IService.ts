export type IService = {
    id: string;
    name: string;
    description?: string;
    category?: string;
    basePrice?: number;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateServiceRequest = {
    name: string;
    description?: string;
    category?: string;
    basePrice?: number;
};

export type ServiceResponse = IService;
