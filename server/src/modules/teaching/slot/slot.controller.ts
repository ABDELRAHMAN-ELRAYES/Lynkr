import { Request, Response, NextFunction } from "express";
import SlotService from "./slot.service";
import { catchAsync } from "../../../utils/catch-async";

class SlotController {
    static createSlot = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const providerProfileId = req.user?.providerProfile?.id;

        if (!providerProfileId) {
            return res.status(403).json({ message: "Provider profile required" });
        }

        const result = await SlotService.createSlot(providerProfileId, req.body, next);

        if (result) {
            return res.status(201).json({
                status: "success",
                data: result
            });
        }
    });

    static createMultipleSlots = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const providerProfileId = req.user?.providerProfile?.id;

        if (!providerProfileId) {
            return res.status(403).json({ message: "Provider profile required" });
        }

        const { slots } = req.body;

        if (!Array.isArray(slots) || slots.length === 0) {
            return res.status(400).json({ message: "Slots array is required" });
        }

        const result = await SlotService.createMultipleSlots(providerProfileId, slots, next);

        if (result) {
            return res.status(201).json({
                status: "success",
                data: result
            });
        }
    });

    static getMySlots = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const providerProfileId = req.user?.providerProfile?.id;

        if (!providerProfileId) {
            return res.status(403).json({ message: "Provider profile required" });
        }

        const result = await SlotService.getMySlots(providerProfileId, next);

        if (result) {
            return res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static getProviderSlots = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { providerId } = req.params;

        const result = await SlotService.getProviderAvailableSlots(providerId, next);

        if (result) {
            return res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static getSlotById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const result = await SlotService.getSlotById(id, next);

        if (result) {
            return res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static updateSlot = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const providerProfileId = req.user?.providerProfile?.id;
        const { id } = req.params;

        if (!providerProfileId) {
            return res.status(403).json({ message: "Provider profile required" });
        }

        const result = await SlotService.updateSlot(id, providerProfileId, req.body, next);

        if (result) {
            return res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static deleteSlot = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const providerProfileId = req.user?.providerProfile?.id;
        const { id } = req.params;

        if (!providerProfileId) {
            return res.status(403).json({ message: "Provider profile required" });
        }

        const result = await SlotService.deleteSlot(id, providerProfileId, next);

        if (result) {
            return res.status(200).json({
                status: "success",
                message: "Slot deleted successfully"
            });
        }
    });
}

export default SlotController;
