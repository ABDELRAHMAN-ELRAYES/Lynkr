import AvailabilityRepository from "./availability.repository";
import AppError from "../../utils/app-error";
import { NextFunction } from "express";
import { ICreateAvailabilityData, ISaveAvailabilityPayload } from "./types/IAvailability";

class AvailabilityService {
    private availabilityRepository: AvailabilityRepository;
    static instance: AvailabilityService;

    private constructor() {
        this.availabilityRepository = AvailabilityRepository.getInstance();
    }

    static getInstance(): AvailabilityService {
        if (!AvailabilityService.instance) {
            AvailabilityService.instance = new AvailabilityService();
        }
        return AvailabilityService.instance;
    }

    /**
     * Validate time format (HH:mm)
     */
    private validateTimeFormat(time: string): boolean {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return timeRegex.test(time);
    }

    /**
     * Validate day of week (0-6)
     */
    private validateDayOfWeek(day: number): boolean {
        return Number.isInteger(day) && day >= 0 && day <= 6;
    }

    /**
     * Compare times to ensure start is before end
     */
    private isStartBeforeEnd(startTime: string, endTime: string): boolean {
        return startTime < endTime;
    }

    /**
     * Create a single availability entry
     */
    async createAvailability(
        providerProfileId: string,
        data: ICreateAvailabilityData,
        next: NextFunction
    ) {
        // Validate day of week
        if (!this.validateDayOfWeek(data.dayOfWeek)) {
            return next(new AppError(400, "Invalid day of week. Must be 0-6 (Sunday-Saturday)"));
        }

        // Validate time formats
        if (!this.validateTimeFormat(data.startTime) || !this.validateTimeFormat(data.endTime)) {
            return next(new AppError(400, "Invalid time format. Use HH:mm (e.g., 09:00)"));
        }

        // Validate start time is before end time
        if (!this.isStartBeforeEnd(data.startTime, data.endTime)) {
            return next(new AppError(400, "Start time must be before end time"));
        }

        // Check for overlapping availability on the same day
        const overlapping = await this.availabilityRepository.getOverlappingAvailabilities(
            providerProfileId,
            data.dayOfWeek,
            data.startTime,
            data.endTime
        );

        if (overlapping.length > 0) {
            return next(new AppError(400, "This time slot overlaps with an existing availability"));
        }

        return await this.availabilityRepository.createAvailability(providerProfileId, data);
    }

    /**
     * Get all availabilities for a provider
     */
    async getProviderAvailabilities(providerProfileId: string) {
        return await this.availabilityRepository.getAvailabilitiesByProviderId(providerProfileId);
    }

    /**
     * Get availability by ID
     */
    async getAvailabilityById(id: string) {
        return await this.availabilityRepository.getAvailabilityById(id);
    }

    /**
     * Save all availabilities for a provider (bulk replace)
     * This deletes existing availabilities and creates new ones
     */
    async saveAvailabilities(
        providerProfileId: string,
        payload: ISaveAvailabilityPayload,
        next: NextFunction
    ) {
        const { availabilities } = payload;

        // Validate all entries
        for (const entry of availabilities) {
            if (!this.validateDayOfWeek(entry.dayOfWeek)) {
                return next(new AppError(400, `Invalid day of week: ${entry.dayOfWeek}`));
            }
            if (!this.validateTimeFormat(entry.startTime) || !this.validateTimeFormat(entry.endTime)) {
                return next(new AppError(400, `Invalid time format in entry for day ${entry.dayOfWeek}`));
            }
            if (!this.isStartBeforeEnd(entry.startTime, entry.endTime)) {
                return next(new AppError(400, `Start time must be before end time for day ${entry.dayOfWeek}`));
            }
        }

        // Check for overlapping times within the same day in the payload
        const dayGroups = new Map<number, ICreateAvailabilityData[]>();
        for (const entry of availabilities) {
            if (!dayGroups.has(entry.dayOfWeek)) {
                dayGroups.set(entry.dayOfWeek, []);
            }
            dayGroups.get(entry.dayOfWeek)!.push(entry);
        }

        for (const [day, entries] of dayGroups) {
            for (let i = 0; i < entries.length; i++) {
                for (let j = i + 1; j < entries.length; j++) {
                    const a = entries[i];
                    const b = entries[j];
                    // Check if times overlap
                    if (
                        (a.startTime <= b.startTime && a.endTime > b.startTime) ||
                        (b.startTime <= a.startTime && b.endTime > a.startTime)
                    ) {
                        return next(new AppError(400, `Overlapping times found for day ${day}`));
                    }
                }
            }
        }

        // Delete existing availabilities for this provider
        await this.availabilityRepository.deleteAllByProviderId(providerProfileId);

        // Create new availabilities
        if (availabilities.length > 0) {
            await this.availabilityRepository.bulkCreateAvailabilities(providerProfileId, availabilities);
        }

        // Return the newly created availabilities
        return await this.availabilityRepository.getAvailabilitiesByProviderId(providerProfileId);
    }

    /**
     * Delete a specific availability
     */
    async deleteAvailability(id: string, providerProfileId: string, next: NextFunction) {
        const availability = await this.availabilityRepository.getAvailabilityById(id);

        if (!availability) {
            return next(new AppError(404, "Availability not found"));
        }

        if (availability.providerProfileId !== providerProfileId) {
            return next(new AppError(403, "Not authorized to delete this availability"));
        }

        return await this.availabilityRepository.deleteAvailability(id);
    }
}

export default AvailabilityService;
