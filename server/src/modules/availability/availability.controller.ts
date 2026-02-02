import { Request, Response, NextFunction } from "express";
import AvailabilityService from "./availability.service";
import AppError from "../../utils/app-error";
import { catchAsync } from "@/utils/catch-async";
import { IUser } from "../user/types/IUser";


export const saveAvailabilities = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const userId = user.id;
    const { availabilities } = req.body;

    if (!Array.isArray(availabilities)) {
        return next(new AppError(400, "availabilities must be an array"));
    }

    const result = await AvailabilityService.saveAvailabilities(
        userId,
        { availabilities },
        next
    );

    if (!result) return;

    res.status(200).json({
        status: "success",
        message: "Availability saved successfully",
        data: result
    });
});

/**
 * Get authenticated provider's own availabilities
 * GET /api/availability/my
 */
export const getMyAvailabilities = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const availabilities = await AvailabilityService.getProviderAvailabilities(user.id);

    res.status(200).json({
        status: "success",
        data: availabilities
    });
});

/**
 * Get a provider's public availabilities
 * GET /api/availability/provider/:providerId
 */
export const getProviderAvailabilities = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    const providerId = user.id;
    if (!providerId) {
        return next(new AppError(400, "Provider ID is required"));
    }

    const availabilities = await AvailabilityService.getProviderAvailabilities(providerId);

    res.status(200).json({
        status: "success",
        data: availabilities
    });
});

/**
 * Delete a specific availability
 * DELETE /api/availability/:id
 */
export const deleteAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = req.user as IUser;
    const providerId = user.id;
    if (!providerId) {
        return next(new AppError(403, "Only providers can delete availability"));
    }

    const result = await AvailabilityService.deleteAvailability(id, providerId, next);

    if (!result) return;

    res.status(200).json({
        status: "success",
        message: "Availability deleted successfully"
    });
});
