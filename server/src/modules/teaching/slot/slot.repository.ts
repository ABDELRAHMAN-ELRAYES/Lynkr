import PrismaClientSingleton from "../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../utils/app-error";
import { ICreateSlotData, IUpdateSlotData } from "./types/ISlot";

class SlotRepository {
    private prisma: PrismaClient;
    static instance: SlotRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): SlotRepository {
        if (!SlotRepository.instance) {
            SlotRepository.instance = new SlotRepository();
        }
        return SlotRepository.instance;
    }

    async createSlot(providerProfileId: string, data: ICreateSlotData) {
        try {
            return await this.prisma.teachingSlot.create({
                data: {
                    providerProfileId,
                    slotDate: new Date(data.slotDate),
                    startTime: data.startTime,
                    endTime: data.endTime,
                    durationMinutes: data.durationMinutes,
                    sessionType: data.sessionType,
                    maxParticipants: data.maxParticipants || 1,
                    timezone: data.timezone || "UTC"
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create slot");
        }
    }

    async getSlotById(id: string) {
        try {
            return await this.prisma.teachingSlot.findUnique({
                where: { id },
                include: {
                    session: {
                        include: {
                            participants: true
                        }
                    },
                    providerProfile: {
                        select: {
                            id: true,
                            title: true,
                            hourlyRate: true,
                            user: { select: { id: true, firstName: true, lastName: true } }
                        }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get slot");
        }
    }

    async getSlotsByProviderId(providerProfileId: string) {
        try {
            return await this.prisma.teachingSlot.findMany({
                where: { providerProfileId },
                include: {
                    session: {
                        include: {
                            participants: true
                        }
                    }
                },
                orderBy: [
                    { slotDate: "asc" },
                    { startTime: "asc" }
                ]
            });
        } catch (error) {
            throw new AppError(500, "Failed to get provider slots");
        }
    }

    async getAvailableSlots(providerProfileId: string, fromDate: Date) {
        try {
            return await this.prisma.teachingSlot.findMany({
                where: {
                    providerProfileId,
                    slotDate: { gte: fromDate },
                    OR: [
                        { session: null },
                        {
                            session: {
                                participants: {
                                    none: {}
                                }
                            }
                        },
                        {
                            sessionType: "GROUP",
                            session: {
                                status: "SCHEDULED"
                            }
                        }
                    ]
                },
                include: {
                    session: {
                        include: {
                            participants: true
                        }
                    },
                    providerProfile: {
                        select: {
                            id: true,
                            title: true,
                            hourlyRate: true,
                            user: { select: { id: true, firstName: true, lastName: true } }
                        }
                    }
                },
                orderBy: [
                    { slotDate: "asc" },
                    { startTime: "asc" }
                ]
            });
        } catch (error) {
            throw new AppError(500, "Failed to get available slots");
        }
    }

    async getOverlappingSlots(
        providerProfileId: string,
        slotDate: Date,
        startTime: string,
        endTime: string,
        excludeSlotId?: string
    ) {
        try {
            return await this.prisma.teachingSlot.findMany({
                where: {
                    providerProfileId,
                    slotDate,
                    id: excludeSlotId ? { not: excludeSlotId } : undefined,
                    OR: [
                        {
                            AND: [
                                { startTime: { lte: startTime } },
                                { endTime: { gt: startTime } }
                            ]
                        },
                        {
                            AND: [
                                { startTime: { lt: endTime } },
                                { endTime: { gte: endTime } }
                            ]
                        },
                        {
                            AND: [
                                { startTime: { gte: startTime } },
                                { endTime: { lte: endTime } }
                            ]
                        }
                    ]
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to check overlapping slots");
        }
    }

    async updateSlot(id: string, data: IUpdateSlotData) {
        try {
            return await this.prisma.teachingSlot.update({
                where: { id },
                data
            });
        } catch (error) {
            throw new AppError(500, "Failed to update slot");
        }
    }

    async deleteSlot(id: string) {
        try {
            return await this.prisma.teachingSlot.delete({
                where: { id }
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete slot");
        }
    }

    async deleteExpiredUnbookedSlots() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return await this.prisma.teachingSlot.deleteMany({
                where: {
                    slotDate: { lt: today },
                    session: null
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete expired slots");
        }
    }
}

export default SlotRepository;
