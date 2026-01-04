export type IProfile = {
    id: string;
    userId: string;
    bio?: string;
    title?: string;
    hourlyRate?: number;
    availability?: string;
    skills?: string[];
    portfolio?: string[];
    createdAt: Date;
    updatedAt: Date;
};

export type IProfileEducation = {
    id: string;
    profileId: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
};

export type IProfileLanguage = {
    id: string;
    profileId: string;
    language: string;
    proficiency: string;
};

export type IProfileWorkHistory = {
    id: string;
    profileId: string;
    company: string;
    position: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
};

export type CreateProfileRequest = {
    userId: string;
    bio?: string;
    title?: string;
    hourlyRate?: number;
    availability?: string;
    skills?: string[];
    education?: Omit<IProfileEducation, "id" | "profileId">[];
    languages?: Omit<IProfileLanguage, "id" | "profileId">[];
    workHistory?: Omit<IProfileWorkHistory, "id" | "profileId">[];
};

export type ProfileResponse = IProfile & {
    education?: IProfileEducation[];
    languages?: IProfileLanguage[];
    workHistory?: IProfileWorkHistory[];
};
