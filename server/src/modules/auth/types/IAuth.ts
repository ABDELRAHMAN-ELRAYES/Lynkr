import { UserRole, AdminPrivilege } from "../../../enum/UserRole";

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    email: string;
    password: string;
    verificationCode: string;
};

export type NoCacheRegisterUserRequest = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
};

export type NoCachePendingUserRegistration = {
    email: string;
    verificationCode: string;
};

export type ForgotPasswordRequest = {
    email: string;
};

export type VerifyResetPasswordRequest = {
    email: string;
    verificationCode: string;
};

export type ResetPasswordRequest = {
    email: string;
    password: string;
    verificationCode: string;
};

export type AuthResponse = {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        active: boolean;
        privileges?: AdminPrivilege[];
    };
    token?: string;
};
