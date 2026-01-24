// ============================================
// Profile Types - Aligned with Backend
// ============================================

// Status Types
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LanguageProficiency = 'BASIC' | 'CONVERSATIONAL' | 'FLUENT' | 'NATIVE';

// ============================================
// Core Entity Types
// ============================================

export interface ProviderProfile {
    id: string;
    userId: string;
    title?: string;
    bio?: string;
    hourlyRate?: number;
    isApproved: boolean;
    serviceId?: string;
    createdAt: string;
    updatedAt: string;
    // Related entities
    user?: ProfileUser;
    service?: ProfileService;
    skills?: ProfileSkill[];
    experiences?: Experience[];
    education?: Education[];
    languages?: Language[];
}

export interface ProfileUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    country?: string;
    avatarUrl?: string;
}

export interface ProfileService {
    id: string;
    name: string;
    description?: string;
}

export interface ProfileSkill {
    id: string;
    skillName: string;
}

// ============================================
// Education Types
// ============================================

export interface Education {
    id: string;
    providerProfileId: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    description?: string;
    startDate: string;
    endDate?: string;
    createdAt?: string;
}

export interface CreateEducationPayload {
    providerProfileId: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    description?: string;
    startDate: string;
    endDate?: string;
}

export interface UpdateEducationPayload {
    school?: string;
    degree?: string;
    fieldOfStudy?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

// ============================================
// Experience Types
// ============================================

export interface Experience {
    id: string;
    providerProfileId: string;
    title: string;
    company: string;
    location: string;
    country: string;
    description?: string;
    startDate: string;
    endDate?: string;
    createdAt?: string;
}

export interface CreateExperiencePayload {
    providerProfileId: string;
    title: string;
    company: string;
    location: string;
    country: string;
    description?: string;
    startDate: string;
    endDate?: string;
}

export interface UpdateExperiencePayload {
    title?: string;
    company?: string;
    location?: string;
    country?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

// ============================================
// Language Types
// ============================================

export interface Language {
    id: string;
    providerProfileId: string;
    language: string;
    proficiency: LanguageProficiency;
    createdAt?: string;
}

export interface CreateLanguagePayload {
    providerProfileId: string;
    language: string;
    proficiency: LanguageProficiency;
}

export interface UpdateLanguagePayload {
    language?: string;
    proficiency?: LanguageProficiency;
}

// ============================================
// Provider Application Types
// ============================================

export interface ProviderApplication {
    id: string;
    userId: string;
    providerProfileId?: string;
    status: ApplicationStatus;
    cooldownEndsAt?: string;
    createdAt: string;
    updatedAt: string;
    reviews?: ApplicationReview[];
}

export interface ApplicationReview {
    id: string;
    applicationId: string;
    adminId: string;
    decision: 'APPROVED' | 'REJECTED';
    reason?: string;
    reviewedAt: string;
}

// ============================================
// API Request/Response Types
// ============================================

export interface ProfileRequestWithFullData {
    id: string;
    userId: string;
    type: 'JOIN_REQUEST' | 'UPDATE_REQUEST';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt?: string;
    adminNotes?: string;
    user?: ProfileUser;
    profile?: {
        title?: string;
        bio?: string;
        hourlyRate?: number;
    };
    service?: ProfileService;
    skills?: ProfileSkill[];
    experiences?: Experience[];
    education?: Education[];
    languages?: Language[];
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

export interface UpdateProfilePayload {
    title?: string;
    bio?: string;
    hourlyRate?: number;
}

// ============================================
// API Response Wrappers
// ============================================

export interface ProfileResponse {
    status: string;
    data: {
        profile: ProviderProfile;
    };
}

export interface ApplicationsResponse {
    status: string;
    data: ProviderApplication[];
}
