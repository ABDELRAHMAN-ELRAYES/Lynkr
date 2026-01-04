import { AdminPrivilege, UserRole } from "../../../enum/UserRole";

export type ICreateUser = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    privileges?: AdminPrivilege[];
};

export type NewUserData = ICreateUser & {
    username: string;
};

export type IUser = ICreateUser & {
    id: string;
    avatar?: string;
    active: boolean;
    username: string;
    createdAt: Date;
    updatedAt: Date;
};

export type UserResponse = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: UserRole;
    active: boolean;
    createdAt: Date;
    phone: string;
    privileges?: AdminPrivilege[];
};

export type UpdateUserRequest = ICreateUser & {
    id: string;
    username: string;
};

export interface UsersBatchResponse {
    users: UserResponse[];
    total: number;
}
