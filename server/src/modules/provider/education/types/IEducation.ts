// Education Type Definitions

export interface IEducation {
    id: string;
    providerProfileId: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    createdAt?: Date;
}

export interface ICreateEducationData {
    providerProfileId: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    description?: string;
    startDate: Date | string;
    endDate?: Date | string;
}

export interface IUpdateEducationData {
    school?: string;
    degree?: string;
    fieldOfStudy?: string;
    description?: string;
    startDate?: Date | string;
    endDate?: Date | string;
}
