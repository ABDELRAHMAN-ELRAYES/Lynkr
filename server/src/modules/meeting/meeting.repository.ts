import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";
import { IUpdateMeetingData } from "./types/IMeeting";

class MeetingRepository {
    private prisma: PrismaClient;
    static instance: MeetingRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): MeetingRepository {
        if (!MeetingRepository.instance) {
            MeetingRepository.instance = new MeetingRepository();
        }
        return MeetingRepository.instance;
    }

    async createMeeting(data: {
        projectId: string;
        hostId: string;
        guestId: string;
        channelName: string;
        scheduledAt?: Date;
    }) {
        try {
            return await this.prisma.meeting.create({
                data,
                include: {
                    host: { select: { id: true, firstName: true, lastName: true } },
                    guest: { select: { id: true, firstName: true, lastName: true } },
                    project: { select: { id: true, status: true } },
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to create meeting");
        }
    }

    async getMeetingById(id: string) {
        try {
            return await this.prisma.meeting.findUnique({
                where: { id },
                include: {
                    host: { select: { id: true, firstName: true, lastName: true } },
                    guest: { select: { id: true, firstName: true, lastName: true } },
                    project: { select: { id: true, status: true } },
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get meeting");
        }
    }

    async getMeetingByChannelName(channelName: string) {
        try {
            return await this.prisma.meeting.findUnique({
                where: { channelName },
                include: {
                    host: { select: { id: true, firstName: true, lastName: true } },
                    guest: { select: { id: true, firstName: true, lastName: true } },
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get meeting by channel");
        }
    }

    async getMeetingsByProjectId(projectId: string) {
        try {
            return await this.prisma.meeting.findMany({
                where: { projectId },
                include: {
                    host: { select: { id: true, firstName: true, lastName: true } },
                    guest: { select: { id: true, firstName: true, lastName: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get project meetings");
        }
    }

    async getUserMeetings(userId: string) {
        try {
            return await this.prisma.meeting.findMany({
                where: {
                    OR: [{ hostId: userId }, { guestId: userId }],
                },
                include: {
                    host: { select: { id: true, firstName: true, lastName: true } },
                    guest: { select: { id: true, firstName: true, lastName: true } },
                    project: { select: { id: true, status: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get user meetings");
        }
    }

    async updateMeeting(id: string, data: IUpdateMeetingData) {
        try {
            return await this.prisma.meeting.update({
                where: { id },
                data,
                include: {
                    host: { select: { id: true, firstName: true, lastName: true } },
                    guest: { select: { id: true, firstName: true, lastName: true } },
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to update meeting");
        }
    }

    async deleteMeeting(id: string) {
        try {
            return await this.prisma.meeting.delete({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to delete meeting");
        }
    }
}

export default MeetingRepository;
