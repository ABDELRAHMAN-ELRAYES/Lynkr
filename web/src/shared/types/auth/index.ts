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
        otp: {
            code: string;
            expiresIn: string;
        };
    };
}

// Payload for register verification - matches backend IRegisterData
export interface RegisterVerificationPayload {
    otp: {
        hashedOtp: string;
        expiresIn: string;
        enteredOtp: string;
    };
    user: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phone?: string;
        role: string;
    };
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

// Response from /auth/me endpoint
export interface CurrentUserResponse {
    success: boolean;
    data: {
        user?: {
            id: string;
            firstName?: string;
            first_name?: string;
            lastName?: string;
            last_name?: string;
            email: string;
            country?: string;
            active?: boolean;
            isActive?: boolean;
            is_active?: boolean;
            role: string;
            privileges?: string[];
            allowedTabs?: string[];
        };
        // Fallback for direct data access
        id?: string;
        firstName?: string;
        first_name?: string;
        lastName?: string;
        last_name?: string;
        email?: string;
        country?: string;
        active?: boolean;
        isActive?: boolean;
        is_active?: boolean;
        role?: string;
    } | null;
}

// Logout response
export interface LogoutResponse {
    success: boolean;
    message: string;
}

// Re-export provider signup types for convenience
export * from './signup';
