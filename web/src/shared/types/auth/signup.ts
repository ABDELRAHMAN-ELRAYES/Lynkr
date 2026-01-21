export interface Education {
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    fromYear: string;
    toYear: string;
    description: string;
}
export interface EducationAPI {
    school: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate: string;
    description?: string;
}
export interface Experience {
    id: string;
    title: string;
    company: string;
    location: string;
    country: string;
    startMonth: string;
    startYear: string;
    endMonth?: string;
    endYear?: string;
    currentlyWorking: boolean;
    description?: string;
}

export interface ExperienceAPI {
    title: string;
    company: string;
    location: string;
    country: string;
    startDate: string;
    endDate: string;
    description?: string;
}

export type ServiceTypes = "ENGINEERING" | "WRITING" | "TUTORING";
export type LanguageProficiencyType =
    | "BASIC"
    | "CONVERSATIONAL"
    | "FLUENT"
    | "NATIVE";
export interface Language {
    id: string;
    name: string;
    proficiency: LanguageProficiencyType;
}

export interface FormData {
    serviceId: string;
    serviceType: ServiceTypes;
    skills: string[];
    education: Education[];
    experience: Experience[];
    languages: Language[];
    hourlyRate: string;
    title: string;
    bio: string;
}
