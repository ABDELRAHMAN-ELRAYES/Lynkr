// Slot Types - No Prisma dependencies

export type SessionType = "ONE_TO_ONE" | "GROUP";

export interface ITeachingSlot {
    id: string;
    providerProfileId: string;
    slotDate: Date;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    sessionType: SessionType;
    maxParticipants: number;
    timezone: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateSlotData {
    slotDate: string | Date;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    sessionType: SessionType;
    maxParticipants?: number;
    timezone?: string;
}

export interface IUpdateSlotData {
    startTime?: string;
    endTime?: string;
    durationMinutes?: number;
    sessionType?: SessionType;
    maxParticipants?: number;
}

export interface ISlotWithSession extends ITeachingSlot {
    session?: {
        id: string;
        status: string;
        participantCount: number;
    } | null;
}
