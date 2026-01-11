// Language Type Definitions

export interface ILanguage {
    id: string;
    providerProfileId: string;
    language: string;
    proficiency: string; // BASIC, CONVERSATIONAL, FLUENT, NATIVE
    createdAt?: Date;
}

export interface ICreateLanguageData {
    providerProfileId: string;
    language: string;
    proficiency: string;
}

export interface IUpdateLanguageData {
    language?: string;
    proficiency?: string;
}

export type LanguageProficiency = "BASIC" | "CONVERSATIONAL" | "FLUENT" | "NATIVE";
