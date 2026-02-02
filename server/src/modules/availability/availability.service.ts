import AvailabilityRepository from "./availability.repository";
import AppError from "../../utils/app-error";
import { NextFunction } from "express";
import { ICreateAvailabilityData, ISaveAvailabilityPayload } from "./types/IAvailability";
import { isStartBeforeEnd, validateDayOfWeek, validateTimeFormat } from "@/utils/date-time-helpers";
import ProfileService from "../provider/profile/profile.service";
const WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

class AvailabilityService {
    private static availabilityRepository: AvailabilityRepository = AvailabilityRepository.getInstance();
    static instance: AvailabilityService;

    private constructor() {
        if (!AvailabilityService.availabilityRepository) AvailabilityService.availabilityRepository = AvailabilityRepository.getInstance();
    }

    static getInstance(): AvailabilityService {
        if (!AvailabilityService.instance) {
            AvailabilityService.instance = new AvailabilityService();
        }
        return AvailabilityService.instance;
    }

    /**
     * Create a single availability entry
     */
    static async createAvailability(
        providerId: string,
        data: ICreateAvailabilityData,
        next: NextFunction
    ) {
        /// Get provider Profile ID
        const providerProfile = await ProfileService.getProviderProfileByUserId(providerId, next);
        if (!providerProfile || !providerProfile.id) {
            return next(new AppError(403, "Non Providers users can't set availabilities")
            )
        }
        const providerProfileId: string = providerProfile.id;

        // Validate day of week
        if (!validateDayOfWeek(data.dayOfWeek)) {
            return next(new AppError(400, "Invalid day of week. Must be 0-6 (Sunday-Saturday)"));
        }

        // Validate time formats
        if (!validateTimeFormat(data.startTime) || !validateTimeFormat(data.endTime)) {
            return next(new AppError(400, "Invalid time format. Use HH:mm (e.g., 09:00)"));
        }

        // Validate start time is before end time
        if (!isStartBeforeEnd(data.startTime, data.endTime)) {
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
    static async getProviderAvailabilities(providerId: string) {
        return await this.availabilityRepository.getAvailabilitiesByProviderId(providerId);
    }

    /**
     * Get availability by ID
     */
    static async getAvailabilityById(id: string) {
        return await this.availabilityRepository.getAvailabilityById(id);
    }

    /**
     * Save all availabilities for a provider (bulk replace)
     * This deletes existing availabilities and creates new ones
     */
    static async saveAvailabilities(
        providerId: string,
        payload: ISaveAvailabilityPayload,
        next: NextFunction
    ) {
        const { availabilities } = payload;

        // Get the provider profile Id
        const providerProfile = await ProfileService.getProviderProfileByUserId(providerId, next);
        if (!providerProfile || !providerProfile.id) {
            return next(new AppError(403, "Non Providers users can't set availabilities")
            )
        }
        const providerProfileId: string = providerProfile.id;

        // Validate all entries
        for (const entry of availabilities) {
            if (!validateDayOfWeek(entry.dayOfWeek)) {
                return next(new AppError(400, `Invalid day of week: ${entry.dayOfWeek}`));
            }
            if (!validateTimeFormat(entry.startTime) || !validateTimeFormat(entry.endTime)) {
                return next(new AppError(400, `Invalid time format in entry for day ${entry.dayOfWeek}`));
            }
            if (!isStartBeforeEnd(entry.startTime, entry.endTime)) {
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
                        return next(new AppError(400, `Overlapping times found for ${WEEKDAYS[day]}`));
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
    static async deleteAvailability(id: string, providerId: string, next: NextFunction) {
        /// Get provider Profile ID
        const providerProfile = await ProfileService.getProviderProfileByUserId(providerId, next);
        if (!providerProfile || !providerProfile.id) {
            return next(new AppError(403, "Non Providers users can't set availabilities")
            )
        }
        const providerProfileId: string = providerProfile.id;

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
