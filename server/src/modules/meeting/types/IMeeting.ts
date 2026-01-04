export type IMeeting = {
    id: string;
    channelName: string;
    hostId: string;
    participantId?: string;
    status: string;
    startTime: Date;
    endTime?: Date;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateMeetingRequest = {
    channelName: string;
    hostId: string;
    participantId?: string;
};

export type AgoraTokenRequest = {
    channelName: string;
    uid: number;
};

export type AgoraTokenResponse = {
    token: string;
    appId: string;
    channelName: string;
    uid: number;
};

export type MeetingResponse = IMeeting;
