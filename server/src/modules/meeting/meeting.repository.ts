import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";

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

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    async createMeeting(data: any): Promise<any> {
        try {
            return await this.prisma.meeting.create({ data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to create meeting");
        }
    }

    async getAllMeetings(): Promise<any[]> {
        try {
            return await this.prisma.meeting.findMany({
                orderBy: { createdAt: "desc" },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get meetings");
        }
    }

    async getMeetingById(id: string): Promise<any> {
        try {
            return await this.prisma.meeting.findUnique({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to get meeting");
        }
    }

    async updateMeeting(id: string, data: any): Promise<any> {
        try {
            return await this.prisma.meeting.update({ where: { id }, data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to update meeting");
        }
    }

    async deleteMeeting(id: string): Promise<any> {
        try {
            return await this.prisma.meeting.delete({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to delete meeting");
        }
    }
}

export default MeetingRepository;
