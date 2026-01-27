// ============================================
// Teaching Types - Aligned with Backend
// ============================================

export type SessionType = "ONE_TO_ONE" | "GROUP";
export type SessionStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
export type ParticipantStatus = "BOOKED" | "CANCELLED" | "REFUNDED";

// ============================================
// Core Entity Types
// ============================================

export interface TeachingSlot {
    id: string;
    providerProfileId: string;
    slotDate: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    sessionType: SessionType;
    maxParticipants: number;
    timezone: string;
    createdAt: string;
    updatedAt: string;
    session?: SessionSummary | null;
    providerProfile?: SlotProvider;
}

export interface SessionSummary {
    id: string;
    status: SessionStatus;
    participantCount: number;
}

export interface SlotProvider {
    id: string;
    title: string | null;
    hourlyRate: number | null;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
}

export interface TeachingSession {
    id: string;
    slotId: string;
    instructorId: string;
    status: SessionStatus;
    channelName: string | null;
    startedAt: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    slot: SlotWithProvider;
    participants: SessionParticipant[];
}

export interface SlotWithProvider {
    id: string;
    slotDate: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    sessionType: SessionType;
    maxParticipants: number;
    timezone: string;
    providerProfile: {
        id: string;
        title: string | null;
        hourlyRate: number | null;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            avatarUrl?: string;
        };
    };
}

export interface SessionParticipant {
    id: string;
    sessionId: string;
    userId: string;
    status: ParticipantStatus;
    bookedAt: string;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
}

// ============================================
// API Payload Types
// ============================================

export interface CreateSlotPayload {
    slotDate: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    sessionType: SessionType;
    maxParticipants?: number;
    timezone?: string;
}

export interface UpdateSlotPayload {
    startTime?: string;
    endTime?: string;
    durationMinutes?: number;
    sessionType?: SessionType;
    maxParticipants?: number;
}

export interface BookSessionPayload {
    slotId: string;
}

export interface ConfirmBookingPayload {
    slotId: string;
    paymentId: string;
}

// ============================================
// API Response Types
// ============================================

export interface BookSessionResponse {
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
}

export interface SessionVideoInfo {
    channelName: string;
    token: string;
    uid: number;
}
