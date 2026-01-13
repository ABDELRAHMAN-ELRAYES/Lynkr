import { Request, Response, NextFunction } from "express";
import SlotService from "./slot.service";
import { catchAsync } from "../../../utils/catch-async";

class SlotController {
    static createSlot = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const providerProfileId = req.user?.providerProfile?.id;

        if (!providerProfileId) {
            res.status(403).json({ message: "Provider profile required" });
            return;
        }

        const result = await SlotService.createSlot(providerProfileId, req.body, next);

        if (result) {
            res.status(201).json({
                status: "success",
                data: result
            });
        }
    });

    static createMultipleSlots = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const providerProfileId = req.user?.providerProfile?.id;

        if (!providerProfileId) {
            res.status(403).json({ message: "Provider profile required" });
            return;
        }

        const { slots } = req.body;

        if (!Array.isArray(slots) || slots.length === 0) {
            res.status(400).json({ message: "Slots array is required" });
            return;
        }

        const result = await SlotService.createMultipleSlots(providerProfileId, slots, next);

        if (result) {
            res.status(201).json({
                status: "success",
                data: result
            });
        }
    });

    static getMySlots = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const providerProfileId = req.user?.providerProfile?.id;

        if (!providerProfileId) {
            res.status(403).json({ message: "Provider profile required" });
            return;
        }

        const result = await SlotService.getMySlots(providerProfileId, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static getProviderSlots = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { providerId } = req.params;

        const result = await SlotService.getProviderAvailableSlots(providerId, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static getSlotById = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;

        const result = await SlotService.getSlotById(id, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static updateSlot = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const providerProfileId = req.user?.providerProfile?.id;
        const { id } = req.params;

        if (!providerProfileId) {
            res.status(403).json({ message: "Provider profile required" });
            return;
        }

        const result = await SlotService.updateSlot(id, providerProfileId, req.body, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static deleteSlot = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const providerProfileId = req.user?.providerProfile?.id;
        const { id } = req.params;

        if (!providerProfileId) {
            res.status(403).json({ message: "Provider profile required" });
            return;
        }

        const result = await SlotService.deleteSlot(id, providerProfileId, next);

        if (result) {
            res.status(200).json({
                status: "success",
                message: "Slot deleted successfully"
            });
        }
    });
}

export default SlotController;
