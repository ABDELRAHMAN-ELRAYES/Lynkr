// Experience Type Definitions

export interface IExperience {
    id: string;
    providerProfileId: string;
    title: string;
    company: string;
    location: string;
    country: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    createdAt?: Date;
}

export interface ICreateExperienceData {
    providerProfileId: string;
    title: string;
    company: string;
    location: string;
    country: string;
    description?: string;
    startDate: Date | string;
    endDate?: Date | string;
}

export interface IUpdateExperienceData {
    title?: string;
    company?: string;
    location?: string;
    country?: string;
    description?: string;
    startDate?: Date | string;
    endDate?: Date | string;
}
