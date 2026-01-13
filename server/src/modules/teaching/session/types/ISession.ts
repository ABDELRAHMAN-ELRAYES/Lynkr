// Session Types - No Prisma dependencies

export type SessionStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
export type ParticipantStatus = "BOOKED" | "CANCELLED" | "REFUNDED";

export interface ITeachingSession {
    id: string;
    slotId: string;
    instructorId: string;
    status: SessionStatus;
    channelName: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISessionParticipant {
    id: string;
    sessionId: string;
    userId: string;
    status: ParticipantStatus;
    bookedAt: Date;
}

export interface IBookSessionData {
    slotId: string;
}

export interface ISessionWithDetails extends ITeachingSession {
    slot: {
        id: string;
        slotDate: Date;
        startTime: string;
        endTime: string;
        durationMinutes: number;
        sessionType: string;
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
            };
        };
    };
    participants: ISessionParticipant[];
}
