export type UserRole =
    | "SUPER_ADMIN"
    | "ADMIN"
    | "CLIENT"
    | "PROVIDER"
    | "PENDING_PROVIDER"
    | "REJECTED_PROVIDER";

// From auth-types.ts
export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    password?: string;
    isActive: boolean;
    role: UserRole;
};

// From auth-types.ts
export type LoginFormData = {
    email: string;
    password: string;
};

// From auth-types.ts
export type SignupFormData = {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    password: string;
};

// From auth-types.ts
export type SignupFormErrors = Partial<{
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    password: string;
}>;

// From auth.service.ts
export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            country?: string;
            role: string;
            privileges?: string[];
            allowedTabs?: string[];
        };
    };
}

export interface RegisterPayload {
    email: string;
    // Originally in auth.service it only had email, but RegisterVerificationPayload has methods.
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data?: {
        email: string;
        otp: string;
    };
}

export interface RegisterVerificationPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    country: string;
    role: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ForgotPasswordResponse {
    success: boolean;
    message: string;
    data?: {
        message: string;
    };
}

export interface ResetPasswordPayload {
    token: string;
    password: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
    data?: {
        user: {
            id: string;
            email: string;
        };
    };
}
