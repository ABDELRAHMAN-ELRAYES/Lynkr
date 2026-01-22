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
    avatar?: string;
}

export interface CreateUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    country?: string;
    role: string;
    isActive?: boolean;
}

export interface UpdateUserPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    country?: string;
    role?: string;
    isActive?: boolean;
}

export interface UserStatistics {
    users: number;
    providers: number;
    admins: number;
    active: number;
    inactive: number;
}

export interface UserBatchParams {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    status?: string; // 'active' | 'inactive'
}

export interface UserBatchResponse {
    users: UserResponse[];
    total: number;
    totalPages: number;
    page: number;
}

