import apiClient from './apiClient';

// Types for profile-related requests and responses
export interface CreateProfileEducation {
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description?: string;
}

export interface CreateProfileWorkHistory {
    title: string;
    company: string;
    location: string;
    country: string;
    startDate: string;
    endDate: string;
    description?: string;
}

export interface CreateProfileLanguage {
    language: string;
    proficiency: 'BASIC' | 'CONVERSATIONAL' | 'FLUENT' | 'NATIVE';
}

export interface CreateProfileRequest {
    title: string;
    bio: string;
    hourlyRate: number;
    imageUrl?: string;
    skills: string;
    serviceType: 'ENGINEERING' | 'WRITING' | 'TUTORING';
}

export interface CreateFullProfileRequest {
    profile: CreateProfileRequest;
    educations?: {
        profileEducations: CreateProfileEducation[];
    };
    workHistories?: {
        profileWorkHistories: CreateProfileWorkHistory[];
    };
    languages?: {
        profileLanguages: CreateProfileLanguage[];
    };
}

export interface ProfileRequest {
    id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    type: 'JOIN_REQUEST' | 'UPDATE_REQUEST';
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface ProfileRequestWithUser extends ProfileRequest {
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
}

// Comprehensive profile data interfaces
export interface ProfileData {
    id: string;
    title: string;
    bio: string;
    hourlyRate: number;
    imageUrl?: string;
    skills: string;
    serviceType: 'ENGINEERING' | 'WRITING' | 'TUTORING';
}

export interface EducationData {
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description?: string;
}

export interface WorkHistoryData {
    id: string;
    title: string;
    company: string;
    location: string;
    country: string;
    startDate: string;
    endDate: string;
    description?: string;
}

export interface LanguageData {
    id: string;
    language: string;
    proficiency: 'BASIC' | 'CONVERSATIONAL' | 'FLUENT' | 'NATIVE';
}

export interface ProfileRequestWithFullData extends ProfileRequest {
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    profile?: ProfileData;
    educations?: EducationData[];
    workHistories?: WorkHistoryData[];
    languages?: LanguageData[];
}

export const profileService = {
    /**
     * Submit a full profile join request for provider signup
     */
    submitProfileJoinRequest: async (data: CreateFullProfileRequest): Promise<ProfileRequest> => {
        const response = await apiClient.post<ProfileRequest>('/profiles/requests', data);
        return response.data;
    },

    /**
     * Get all pending profile requests (for admin)
     */
    getPendingProfileRequests: async (): Promise<ProfileRequestWithUser[]> => {
        const response = await apiClient.get<ProfileRequestWithUser[]>('/profiles/requests/pending');
        return response.data;
    },

    /**
     * Get all pending profile requests with full data (for admin)
     */
    getPendingProfileRequestsWithFullData: async (): Promise<ProfileRequestWithFullData[]> => {
        const response = await apiClient.get<ProfileRequestWithFullData[]>('/profiles/requests/pending/full');
        return response.data;
    },

    /**
     * Evaluate a profile request (approve or reject)
     */
    evaluateProfileRequest: async (
        requestId: string,
        status: 'APPROVED' | 'REJECTED',
        reason: string
    ): Promise<void> => {
        await apiClient.post(`/profiles/requests/${requestId}/evaluations`, {
            status,
            reason
        });
    }
};

export default profileService;
