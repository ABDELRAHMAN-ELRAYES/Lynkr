import SlotRepository from "./slot.repository";
import { NextFunction } from "express";
import AppError from "../../../utils/app-error";
import { ICreateSlotData, IUpdateSlotData } from "./types/ISlot";

class SlotService {
    private static repository = SlotRepository.getInstance();

    // Max weeks ahead for slot creation
    private static MAX_WEEKS_AHEAD = 4;

    static async createSlot(providerProfileId: string, data: ICreateSlotData, next: NextFunction) {
        // Validate date is not in the past
        const slotDate = new Date(data.slotDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (slotDate < today) {
            return next(new AppError(400, "Cannot create slot for past date"));
        }

        // Validate max 4 weeks ahead
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + this.MAX_WEEKS_AHEAD * 7);

        if (slotDate > maxDate) {
            return next(new AppError(400, `Cannot create slot more than ${this.MAX_WEEKS_AHEAD} weeks ahead`));
        }

        // Validate time format (HH:mm)
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(data.startTime) || !timeRegex.test(data.endTime)) {
            return next(new AppError(400, "Invalid time format. Use HH:mm"));
        }

        // Validate end time is after start time
        if (data.startTime >= data.endTime) {
            return next(new AppError(400, "End time must be after start time"));
        }

        // Validate max participants for group sessions
        if (data.sessionType === "GROUP" && (data.maxParticipants || 1) > 20) {
            return next(new AppError(400, "Maximum 20 participants allowed for group sessions"));
        }

        // Check for overlapping slots
        const overlapping = await this.repository.getOverlappingSlots(
            providerProfileId,
            slotDate,
            data.startTime,
            data.endTime
        );

        if (overlapping.length > 0) {
            return next(new AppError(400, "Time slot overlaps with existing slot"));
        }

        return await this.repository.createSlot(providerProfileId, data);
    }

    static async createMultipleSlots(
        providerProfileId: string,
        slots: ICreateSlotData[],
        next: NextFunction
    ) {
        const createdSlots: object[] = [];
        const errors: { slot: ICreateSlotData; error: string }[] = [];

        for (const slotData of slots) {
            const result = await this.createSlot(providerProfileId, slotData, (err) => {
                errors.push({ slot: slotData, error: (err as AppError).message });
            });

            if (result) {
                createdSlots.push(result);
            }
        }

        if (errors.length > 0 && createdSlots.length === 0) {
            return next(new AppError(400, `All slots failed: ${errors[0].error}`));
        }

        return { created: createdSlots, errors };
    }

    static async getSlotById(id: string, next: NextFunction) {
        if (!id) {
            return next(new AppError(400, "Slot ID is required"));
        }

        const slot = await this.repository.getSlotById(id);

        if (!slot) {
            return next(new AppError(404, "Slot not found"));
        }

        return slot;
    }

    static async getMySlots(providerProfileId: string, next: NextFunction) {
        if (!providerProfileId) {
            return next(new AppError(400, "Provider profile ID is required"));
        }

        return await this.repository.getSlotsByProviderId(providerProfileId);
    }

    static async getProviderAvailableSlots(providerProfileId: string, next: NextFunction) {
        if (!providerProfileId) {
            return next(new AppError(400, "Provider profile ID is required"));
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return await this.repository.getAvailableSlots(providerProfileId, today);
    }

    static async updateSlot(
        id: string,
        providerProfileId: string,
        data: IUpdateSlotData,
        next: NextFunction
    ) {
        const slot = await this.repository.getSlotById(id);

        if (!slot) {
            return next(new AppError(404, "Slot not found"));
        }

        // Verify ownership
        if (slot.providerProfileId !== providerProfileId) {
            return next(new AppError(403, "Not authorized to update this slot"));
        }

        // Cannot update past slots
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (slot.slotDate < today) {
            return next(new AppError(400, "Cannot update past slot"));
        }

        // Cannot update slot with booked session
        if (slot.session && slot.session.participants.length > 0) {
            return next(new AppError(400, "Cannot update slot with booked participants"));
        }

        // If updating times, check for overlaps
        if (data.startTime || data.endTime) {
            const newStartTime = data.startTime || slot.startTime;
            const newEndTime = data.endTime || slot.endTime;

            if (newStartTime >= newEndTime) {
                return next(new AppError(400, "End time must be after start time"));
            }

            const overlapping = await this.repository.getOverlappingSlots(
                providerProfileId,
                slot.slotDate,
                newStartTime,
                newEndTime,
                id
            );

            if (overlapping.length > 0) {
                return next(new AppError(400, "Time slot overlaps with existing slot"));
            }
        }

        return await this.repository.updateSlot(id, data);
    }

    static async deleteSlot(id: string, providerProfileId: string, next: NextFunction) {
        const slot = await this.repository.getSlotById(id);

        if (!slot) {
            return next(new AppError(404, "Slot not found"));
        }

        // Verify ownership
        if (slot.providerProfileId !== providerProfileId) {
            return next(new AppError(403, "Not authorized to delete this slot"));
        }

        // Cannot delete slot with booked session
        if (slot.session && slot.session.participants.length > 0) {
            return next(new AppError(400, "Cannot delete slot with booked participants. Cancel the session first."));
        }

        return await this.repository.deleteSlot(id);
    }

    static async cleanupExpiredSlots() {
        return await this.repository.deleteExpiredUnbookedSlots();
    }
}

export default SlotService;
