export interface ProfileRequestWithFullData {
    id: string;
    userId: string;
    type: 'JOIN_REQUEST' | 'UPDATE_REQUEST';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt?: string;
    adminNotes?: string;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        country?: string;
    };
    profile?: {
        title?: string;
        bio?: string;
        hourlyRate?: number;
    };
}

export interface ProfileEducation {
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description?: string;
}

export interface ProfileWorkHistory {
    title: string;
    company: string;
    location?: string;
    country?: string;
    startDate: string;
    endDate: string;
    description?: string;
}

export interface ProfileLanguageInput {
    language: string;
    proficiency: string;
}

export interface CreateFullProfileRequest {
    profile: {
        title: string;
        bio: string;
        hourlyRate?: number;
        skills?: string;
        serviceId?: string;
        serviceType?: string;
    };
    educations?: {
        profileEducations: ProfileEducation[];
    };
    workHistories?: {
        profileWorkHistories: ProfileWorkHistory[];
    };
    languages?: {
        profileLanguages: ProfileLanguageInput[];
    };
}
