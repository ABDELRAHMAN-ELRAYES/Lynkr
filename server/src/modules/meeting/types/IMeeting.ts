export type MeetingStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface IMeeting {
    id: string;
    projectId: string;
    hostId: string;
    guestId: string;
    channelName: string;
    status: string;
    scheduledAt?: Date | null;
    startedAt?: Date | null;
    endedAt?: Date | null;
    duration?: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateMeetingData {
    projectId: string;
    hostId: string;
    guestId: string;
    scheduledAt?: string; // ISO string from frontend
}

export interface IUpdateMeetingData {
    status?: MeetingStatus;
    startedAt?: Date;
    endedAt?: Date;
    duration?: number;
}

export interface IMeetingWithParticipants extends IMeeting {
    host: {
        id: string;
        firstName: string;
        lastName: string;
    };
    guest: {
        id: string;
        firstName: string;
        lastName: string;
    };
    project: {
        id: string;
        status: string;
    };
}

export interface IAgoraTokenRequest {
    channelName: string;
    uid: number;
}

export interface IAgoraTokenResponse {
    token: string;
    appId: string;
    channelName: string;
    uid: number;
}
