
// ============================================
// Teaching/Slot Types
// ============================================

export type SessionType = 'ONE_TO_ONE' | 'GROUP';
export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Session {
    id: string;
    slotId: string;
    studentId?: string; // For 1:1
    studentName?: string;
    status: SessionStatus;
    participantCount: number; // For group
    joinUrl?: string;
}

export interface SessionVideoInfo {
    channelName: string;
    token: string;
    uid: number;
}

export interface ProviderProfileInfo {
    id: string;
    title: string;
    hourlyRate: number;
    user: {
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
}

export interface TeachingSlot {
    id: string;
    providerId: string;
    providerProfile?: ProviderProfileInfo;
    slotDate: string; // ISO Date string
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    durationMinutes: number;
    sessionType: SessionType;
    maxParticipants: number;
    price?: number;
    currency?: string;
    isBooked: boolean;
    session?: Session;
    createdAt?: string;
    updatedAt?: string;
}

export interface TeachingSession {
    id: string; // Session ID
    slot: TeachingSlot;
    providerId: string; // Instructor ID
    participants: {
        userId: string;
        name: string;
        avatarUrl?: string;
    }[];
    status: SessionStatus;
    startedAt?: string;
    endedAt?: string;
    videoInfo?: SessionVideoInfo;
}

export interface CreateSlotPayload {
    slotDate: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    sessionType: SessionType;
    maxParticipants?: number;
    price?: number;
    currency?: string;
    timezone?: string;
}
