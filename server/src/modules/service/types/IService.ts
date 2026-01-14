// Service & Skill Types

export interface IService {
    id: string;
    name: string;
    description?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    skills?: ISkill[];
}

export interface ISkill {
    id: string;
    name: string;
    serviceId: string;
    isActive: boolean;
    createdAt: Date;
}

export interface ICreateServiceData {
    name: string;
    description?: string;
}

export interface ICreateSkillData {
    name: string;
    serviceId: string;
}

export interface IUpdateServiceData {
    name?: string;
    description?: string;
    isActive?: boolean;
}
