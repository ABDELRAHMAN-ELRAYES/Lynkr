// Profile Type Definitions
import { IExperience, ICreateExperienceData } from "../../experience/types/IExperience";
import { IEducation, ICreateEducationData } from "../../education/types/IEducation";
import { ILanguage, ICreateLanguageData } from "../../language/types/ILanguage";
import { ISkill } from "../../skill/types/ISkill";
import { IService } from "../../../service/types/IService";

export interface IProviderProfile {
    id: string;
    userId: string;
    title?: string;
    bio?: string;
    hourlyRate?: number;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateProfileData {
    userId: string;
    title?: string;
    bio?: string;
    hourlyRate?: number;
    serviceId?: string; // UUID for service relation
    serviceType?: string;
    skills?: string[]; // Array of skill names
    experiences?: ICreateExperienceData[];
    education?: ICreateEducationData[];
    languages?: ICreateLanguageData[];
}

export interface IUpdateProfileData {
    title?: string;
    bio?: string;
    hourlyRate?: number;
}

export interface IProfileResponse extends IProviderProfile {
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        username?: string;
    };
    serviceId?: string;
    service?: IService;
    skills?: ISkill[];
    experiences?: IExperience[];
    education?: IEducation[];
    languages?: ILanguage[];
}

// Repository layer types (already processed data)
export interface ICreateProfileRepositoryData {
    title?: string;
    bio?: string;
    hourlyRate?: number;
    serviceId?: string;
    skills?: { skillName: string }[];
    experiences?: {
        title: string;
        company: string;
        location: string;
        country: string;
        description?: string;
        startDate: Date;
        endDate?: Date;
    }[];
    education?: {
        school: string;
        degree: string;
        fieldOfStudy: string;
        description?: string;
        startDate: Date;
        endDate?: Date;
    }[];
    languages?: {
        language: string;
        proficiency: string;
    }[];
}
