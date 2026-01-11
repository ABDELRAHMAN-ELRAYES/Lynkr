// Skill Type Definitions

export interface ISkill {
    id: string;
    providerProfileId: string;
    skillName: string;
    createdAt?: Date;
}

export interface ICreateSkillData {
    providerProfileId: string;
    skillName: string;
}

export interface IUpdateSkillData {
    skillName?: string;
}
