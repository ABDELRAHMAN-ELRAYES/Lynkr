// Project Types - Aligned with backend models

export type ProjectStatus = 'IN_PROGRESS' | 'AWAITING_REVIEW' | 'AWAITING_CLIENT_REVIEW' | 'COMPLETED' | 'CANCELLED';
export type MeetingStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

// ===== CORE ENTITIES =====

export interface ProjectParticipant {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
}

export interface ProviderParticipant {
    id: string;
    user: ProjectParticipant;
}

export interface Project {
    id: string;
    title?: string;
    description?: string;
    status: ProjectStatus;
    totalPrice?: number;
    deadline?: string;
    clientId: string;
    providerId?: string; // User ID of provider
    providerProfileId: string;
    requestId?: string;
    proposalId?: string;
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
    // Expanded relations
    client?: ProjectParticipant;
    provider?: ProviderParticipant;
    request?: {
        id: string;
        title: string;
        description?: string;
        category?: string;
        budgetType?: string;
        fromBudget?: number;
        toBudget?: number;
        budgetCurrency?: string;
        deadline?: string;
        serviceId?: string;
        service?: {
            id: string;
            name: string;
        };
    };
}

export interface Conversation {
    id: string;
    projectId: string;
    participant1Id: string;
    participant2Id: string;
    lastMessageAt?: string;
    createdAt: string;
    updatedAt: string;
    // Expanded relations
    participant1?: ProjectParticipant;
    participant2?: ProjectParticipant;
    project?: {
        id: string;
        title: string;
    };
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    // Expanded relations
    sender?: ProjectParticipant;
}

export interface Meeting {
    id: string;
    projectId: string;
    hostId: string;
    guestId: string;
    channelName: string;
    status: MeetingStatus;
    scheduledAt?: string;
    startedAt?: string;
    endedAt?: string;
    duration?: number;
    createdAt: string;
    updatedAt: string;
    // Expanded relations
    host?: ProjectParticipant;
    guest?: ProjectParticipant;
    project?: {
        id: string;
        title: string;
    };
}

export interface ProjectFile {
    id: string;
    projectId: string;
    filename: string;
    path: string;
    url: string;
    mimetype: string;
    size: number;
    uploaderId: string;
    description?: string;
    uploadedAt: string;
    createdAt: string;
    // Expanded relations
    uploader?: ProjectParticipant;
}

export interface ProjectActivity {
    id: string;
    projectId: string;
    userId: string;
    type: string;
    action: string;
    details: string;
    metadata?: any;
    createdAt: string;
    // Expanded relations
    user?: ProjectParticipant;
}

// ===== API PAYLOADS =====

export interface CreateMeetingPayload {
    projectId: string;
    guestId: string;
    scheduledAt?: string;
}

export interface SendMessagePayload {
    conversationId: string;
    content: string;
}

export interface UploadFilePayload {
    file: File;
    description?: string;
}

// ===== API RESPONSES =====

export interface MessagesResponse {
    messages: Message[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface JoinTokenResponse {
    token: string;
    uid: number;
    channelName: string;
    appId: string;
}

// ===== LEGACY TYPE (for backwards compatibility) =====

export interface ActiveProject {
    id: string;
    name: string;
    client: string;
    provider: string;
    status: "in_progress" | "review" | "completed" | "dispute";
    progress: number;
    budget: string;
    deadline: string;
    priority: "high" | "medium" | "low";
}
