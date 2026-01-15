import MeetingRepository from "./meeting.repository";
import SocketService from "../../services/socket.service";
import NotificationService from "../notification/notification.service";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import config from "../../config/config";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";
import { ICreateMeetingData, IAgoraTokenResponse } from "./types/IMeeting";
import { randomUUID } from "crypto";

class MeetingService {
    private static repository = MeetingRepository.getInstance();
    private static socketService = SocketService.getInstance();

    // Generate unique channel name
    private static generateChannelName(): string {
        return `meeting-${randomUUID()}`;
    }

    // Generate Agora RTC token
    static generateAgoraToken(channelName: string, uid: number): IAgoraTokenResponse {
        const appId = config.agora.appId;
        const appCertificate = config.agora.appCertificate;
        const role = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600; // 1 hour
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

        const token = RtcTokenBuilder.buildTokenWithUid(
            appId,
            appCertificate,
            channelName,
            uid,
            role,
            privilegeExpiredTs
        );

        return { token, appId, channelName, uid };
    }

    // Create a new meeting
    static async createMeeting(data: ICreateMeetingData, next: NextFunction) {
        if (!data.projectId) {
            return next(new AppError(400, "Project ID is required"));
        }
        if (!data.hostId) {
            return next(new AppError(400, "Host ID is required"));
        }
        if (!data.guestId) {
            return next(new AppError(400, "Guest ID is required"));
        }
        if (data.hostId === data.guestId) {
            return next(new AppError(400, "Host and guest must be different users"));
        }

        const channelName = this.generateChannelName();
        const scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : undefined;

        const meeting = await this.repository.createMeeting({
            projectId: data.projectId,
            hostId: data.hostId,
            guestId: data.guestId,
            channelName,
            scheduledAt,
        });

        // Notify guest about the meeting invite (real-time)
        this.socketService.sendToUser(data.guestId, "meeting:invite", {
            meetingId: meeting.id,
            projectId: meeting.projectId,
            channelName: meeting.channelName,
            host: meeting.host,
            scheduledAt: meeting.scheduledAt,
        });

        // Persistent notification
        await NotificationService.sendSystemNotification(
            data.guestId,
            "Meeting Invitation",
            `${meeting.host?.firstName || "Someone"} has invited you to a video meeting.`
        );

        return meeting;
    }

    // Get meeting by ID
    static async getMeetingById(id: string, userId: string, next: NextFunction) {
        if (!id) {
            return next(new AppError(400, "Meeting ID is required"));
        }

        const meeting = await this.repository.getMeetingById(id);

        if (!meeting) {
            return next(new AppError(404, "Meeting not found"));
        }

        // Verify user is a participant
        if (meeting.hostId !== userId && meeting.guestId !== userId) {
            return next(new AppError(403, "Not authorized to access this meeting"));
        }

        return meeting;
    }

    // Get token to join meeting
    static async getJoinToken(meetingId: string, userId: string, next: NextFunction) {
        if (!meetingId) {
            return next(new AppError(400, "Meeting ID is required"));
        }

        const meeting = await this.repository.getMeetingById(meetingId);

        if (!meeting) {
            return next(new AppError(404, "Meeting not found"));
        }

        // Verify user is a participant
        if (meeting.hostId !== userId && meeting.guestId !== userId) {
            return next(new AppError(403, "Not authorized to join this meeting"));
        }

        // Generate unique UID for this user (use hash of oderId for consistency)
        const uid = Math.abs(userId.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)) % 100000;

        const tokenData = this.generateAgoraToken(meeting.channelName, uid);

        return {
            ...tokenData,
            meetingId: meeting.id,
            projectId: meeting.projectId,
        };
    }

    // Start a meeting
    static async startMeeting(meetingId: string, userId: string, next: NextFunction) {
        const meeting = await this.repository.getMeetingById(meetingId);

        if (!meeting) {
            return next(new AppError(404, "Meeting not found"));
        }

        if (meeting.hostId !== userId) {
            return next(new AppError(403, "Only host can start the meeting"));
        }

        if (meeting.status !== "PENDING") {
            return next(new AppError(400, "Meeting cannot be started"));
        }

        const updatedMeeting = await this.repository.updateMeeting(meetingId, {
            status: "ACTIVE",
            startedAt: new Date(),
        });

        // Notify guest that meeting started (real-time)
        this.socketService.sendToUser(meeting.guestId, "meeting:started", {
            meetingId: meeting.id,
            channelName: meeting.channelName,
        });

        // Persistent notification
        await NotificationService.sendSystemNotification(
            meeting.guestId,
            "Meeting Started",
            "Your scheduled meeting has started. Join now!"
        );

        return updatedMeeting;
    }

    // End a meeting
    static async endMeeting(meetingId: string, userId: string, next: NextFunction) {
        const meeting = await this.repository.getMeetingById(meetingId);

        if (!meeting) {
            return next(new AppError(404, "Meeting not found"));
        }

        // Either participant can end the meeting
        if (meeting.hostId !== userId && meeting.guestId !== userId) {
            return next(new AppError(403, "Not authorized to end this meeting"));
        }

        if (meeting.status !== "ACTIVE") {
            return next(new AppError(400, "Meeting is not active"));
        }

        const endedAt = new Date();
        const duration = meeting.startedAt
            ? Math.floor((endedAt.getTime() - new Date(meeting.startedAt).getTime()) / 1000)
            : 0;

        const updatedMeeting = await this.repository.updateMeeting(meetingId, {
            status: "COMPLETED",
            endedAt,
            duration,
        });

        // Notify other participant that meeting ended (real-time)
        const otherUserId = meeting.hostId === userId ? meeting.guestId : meeting.hostId;
        this.socketService.sendToUser(otherUserId, "meeting:ended", {
            meetingId: meeting.id,
            duration,
        });

        // Persistent notification
        const durationMinutes = Math.floor(duration / 60);
        await NotificationService.sendSystemNotification(
            otherUserId,
            "Meeting Ended",
            `The meeting has ended. Duration: ${durationMinutes} minutes.`
        );

        return updatedMeeting;
    }

    // Cancel a meeting
    static async cancelMeeting(meetingId: string, userId: string, next: NextFunction) {
        const meeting = await this.repository.getMeetingById(meetingId);

        if (!meeting) {
            return next(new AppError(404, "Meeting not found"));
        }

        if (meeting.hostId !== userId && meeting.guestId !== userId) {
            return next(new AppError(403, "Not authorized to cancel this meeting"));
        }

        if (meeting.status === "COMPLETED" || meeting.status === "CANCELLED") {
            return next(new AppError(400, "Meeting cannot be cancelled"));
        }

        const updatedMeeting = await this.repository.updateMeeting(meetingId, {
            status: "CANCELLED",
        });

        // Notify other participant (real-time)
        const otherUserId = meeting.hostId === userId ? meeting.guestId : meeting.hostId;
        this.socketService.sendToUser(otherUserId, "meeting:cancelled", {
            meetingId: meeting.id,
        });

        // Persistent notification
        await NotificationService.sendSystemNotification(
            otherUserId,
            "Meeting Cancelled",
            "A scheduled meeting has been cancelled."
        );

        return updatedMeeting;
    }

    // Get meetings for a project
    static async getProjectMeetings(projectId: string, _userId: string, next: NextFunction) {
        if (!projectId) {
            return next(new AppError(400, "Project ID is required"));
        }

        return await this.repository.getMeetingsByProjectId(projectId);
    }

    // Get user's meetings
    static async getUserMeetings(userId: string, next: NextFunction) {
        if (!userId) {
            return next(new AppError(400, "User ID is required"));
        }

        return await this.repository.getUserMeetings(userId);
    }

    // Accept meeting invite
    static async acceptMeeting(meetingId: string, userId: string, next: NextFunction) {
        const meeting = await this.repository.getMeetingById(meetingId);

        if (!meeting) {
            return next(new AppError(404, "Meeting not found"));
        }

        if (meeting.guestId !== userId) {
            return next(new AppError(403, "Only invited guest can accept"));
        }

        // Notify host that guest accepted (real-time)
        this.socketService.sendToUser(meeting.hostId, "meeting:accepted", {
            meetingId: meeting.id,
            guestId: userId,
        });

        // Persistent notification
        await NotificationService.sendSystemNotification(
            meeting.hostId,
            "Meeting Accepted",
            `${meeting.guest?.firstName || "The guest"} has accepted your meeting invite.`
        );

        return meeting;
    }

    // Decline meeting invite
    static async declineMeeting(meetingId: string, userId: string, next: NextFunction) {
        const meeting = await this.repository.getMeetingById(meetingId);

        if (!meeting) {
            return next(new AppError(404, "Meeting not found"));
        }

        if (meeting.guestId !== userId) {
            return next(new AppError(403, "Only invited guest can decline"));
        }

        const updatedMeeting = await this.repository.updateMeeting(meetingId, {
            status: "CANCELLED",
        });

        // Notify host that guest declined (real-time)
        this.socketService.sendToUser(meeting.hostId, "meeting:declined", {
            meetingId: meeting.id,
            guestId: userId,
        });

        // Persistent notification
        await NotificationService.sendSystemNotification(
            meeting.hostId,
            "Meeting Declined",
            `${meeting.guest?.firstName || "The guest"} has declined your meeting invite.`
        );

        return updatedMeeting;
    }
}

export default MeetingService;
