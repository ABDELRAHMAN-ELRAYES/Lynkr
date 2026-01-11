// Provider Service Type Definitions

export interface IProviderService {
    id: string;
    providerProfileId: string;
    serviceType: string; // ENGINEERING, WRITING, TUTORING
    createdAt?: Date;
}

export interface ICreateProviderServiceData {
    providerProfileId: string;
    serviceType: string;
}

export interface IUpdateProviderServiceData {
    serviceType?: string;
}

export type ServiceType = "ENGINEERING" | "WRITING" | "TUTORING";
