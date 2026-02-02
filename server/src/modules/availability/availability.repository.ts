import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";
import { ICreateAvailabilityData, IUpdateAvailabilityData } from "./types/IAvailability";

class AvailabilityRepository {
    private prisma: PrismaClient;
    static instance: AvailabilityRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): AvailabilityRepository {
        if (!AvailabilityRepository.instance) {
            AvailabilityRepository.instance = new AvailabilityRepository();
        }
        return AvailabilityRepository.instance;
    }

    async createAvailability(providerProfileId: string, data: ICreateAvailabilityData) {
        try {
            return await this.prisma.providerAvailability.create({
                data: {
                    providerProfileId,
                    dayOfWeek: data.dayOfWeek,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    timezone: data.timezone || "UTC"
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create availability");
        }
    }

    async getAvailabilityById(id: string) {
        try {
            return await this.prisma.providerAvailability.findUnique({
                where: { id }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get availability");
        }
    }

    async getAvailabilitiesByProviderProfileId(providerProfileId: string) {
        try {
            return await this.prisma.providerAvailability.findMany({
                where: {
                    providerProfile: {
                        id: providerProfileId
                    }
                },
                orderBy: [
                    { dayOfWeek: "asc" },
                    { startTime: "asc" }
                ]
            });
        } catch (error) {
            throw new AppError(500, "Failed to get provider availabilities");
        }
    }

    async getOverlappingAvailabilities(
        providerProfileId: string,
        dayOfWeek: number,
        startTime: string,
        endTime: string,
        excludeId?: string
    ) {
        try {
            return await this.prisma.providerAvailability.findMany({
                where: {
                    providerProfileId,
                    dayOfWeek,
                    id: excludeId ? { not: excludeId } : undefined,
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
            throw new AppError(500, "Failed to check overlapping availabilities");
        }
    }

    async updateAvailability(id: string, data: IUpdateAvailabilityData) {
        try {
            return await this.prisma.providerAvailability.update({
                where: { id },
                data
            });
        } catch (error) {
            throw new AppError(500, "Failed to update availability");
        }
    }

    async deleteAvailability(id: string) {
        try {
            return await this.prisma.providerAvailability.delete({
                where: { id }
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete availability");
        }
    }

    async deleteAllByProviderId(providerProfileId: string) {
        try {
            return await this.prisma.providerAvailability.deleteMany({
                where: { providerProfileId }
            });
        } catch (error) {
            throw new AppError(500, "Failed to delete provider availabilities");
        }
    }

    async bulkCreateAvailabilities(providerProfileId: string, availabilities: ICreateAvailabilityData[]) {
        try {
            return await this.prisma.providerAvailability.createMany({
                data: availabilities.map(a => ({
                    providerProfileId,
                    dayOfWeek: a.dayOfWeek,
                    startTime: a.startTime,
                    endTime: a.endTime,
                    timezone: a.timezone || "UTC"
                }))
            });
        } catch (error) {
            throw new AppError(500, "Failed to bulk create availabilities");
        }
    }
}

export default AvailabilityRepository;
