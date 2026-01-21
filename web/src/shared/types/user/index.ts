export interface UserResponse {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    country?: string;
    role: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    country?: string;
    role: string;
    isActive: boolean;
}

export interface UpdateUserPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    country?: string;
    role?: string;
    isActive?: boolean;
}
