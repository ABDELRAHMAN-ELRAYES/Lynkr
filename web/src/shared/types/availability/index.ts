// ============================================
// Provider Availability Types - Aligned with Backend
// ============================================

export interface ProviderAvailability {
    id: string;
    providerProfileId: string;
    dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
    startTime: string; // HH:mm format
    endTime: string;   // HH:mm format
    timezone: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// Meeting Request Types
// ============================================

export type MeetingRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface MeetingRequest {
    id: string;
    projectId: string;
    requestedById: string;
    proposedDate: string;
    proposedTime: string; // HH:mm format
    timezone: string;
    isCustomTime: boolean;
    status: MeetingRequestStatus;
    rejectionReason?: string;
    approvedAt?: string;
    meetingId?: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================
// API Payload Types
// ============================================

export interface CreateAvailabilityPayload {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    timezone?: string;
}

export interface SaveAvailabilityPayload {
    availabilities: CreateAvailabilityPayload[];
}

export interface RequestMeetingPayload {
    projectId: string;
    proposedDate: string;
    proposedTime: string;
    timezone?: string;
    isCustomTime?: boolean;
}

// ============================================
// API Response Types
// ============================================

export interface AvailabilityResponse {
    status: string;
    data: ProviderAvailability[];
}

export interface MeetingRequestResponse {
    status: string;
    data: MeetingRequest;
}
