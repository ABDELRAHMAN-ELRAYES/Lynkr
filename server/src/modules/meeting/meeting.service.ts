import MeetingRepository from "./meeting.repository";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import config from "../../config/config";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";

class MeetingService {
    private static repository = MeetingRepository.getInstance();

    static async generateAgoraToken(channelName: string, uid: number) {
        const appId = config.agora.appId;
        const appCertificate = config.agora.appCertificate;
        const role = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600;
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

        return {
            token,
            appId,
            channelName,
            uid,
        };
    }

    static async createMeeting(data: any, next: NextFunction) {
        return await this.repository.createMeeting(data);
    }

    static async getAllMeetings() {
        return await this.repository.getAllMeetings();
    }

    static async getMeetingById(id: string, next: NextFunction) {
        const meeting = await this.repository.getMeetingById(id);
        if (!meeting) {
            next(new AppError(404, "Meeting not found"));
            return;
        }
        return meeting;
    }

    static async updateMeeting(id: string, data: any, next: NextFunction) {
        return await this.repository.updateMeeting(id, data);
    }

    static async deleteMeeting(id: string, next: NextFunction) {
        return await this.repository.deleteMeeting(id);
    }
}

export default MeetingService;
