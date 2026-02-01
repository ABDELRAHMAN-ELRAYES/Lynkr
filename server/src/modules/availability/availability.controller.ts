import { Request, Response, NextFunction } from "express";
import AvailabilityService from "./availability.service";
import AppError from "../../utils/app-error";

class AvailabilityController {
    private availabilityService: AvailabilityService;
    static instance: AvailabilityController;

    private constructor() {
        this.availabilityService = AvailabilityService.getInstance();
    }

    static getInstance(): AvailabilityController {
        if (!AvailabilityController.instance) {
            AvailabilityController.instance = new AvailabilityController();
        }
        return AvailabilityController.instance;
    }

    /**
     * Save all availabilities for the authenticated provider (bulk replace)
     * POST /api/availability
     */
    saveAvailabilities = async (req: Request, res: Response, next: NextFunction) => {
        const { providerProfileId } = req.user as { providerProfileId?: string };

        if (!providerProfileId) {
            return next(new AppError(403, "Only providers can set availability"));
        }

        const { availabilities } = req.body;

        if (!Array.isArray(availabilities)) {
            return next(new AppError(400, "availabilities must be an array"));
        }

        const result = await this.availabilityService.saveAvailabilities(
            providerProfileId,
            { availabilities },
            next
        );

        if (!result) return;

        res.status(200).json({
            status: "success",
            message: "Availability saved successfully",
            data: result
        });
    };

    /**
     * Get authenticated provider's own availabilities
     * GET /api/availability/my
     */
    getMyAvailabilities = async (req: Request, res: Response, next: NextFunction) => {
        const { providerProfileId } = req.user as { providerProfileId?: string };

        if (!providerProfileId) {
            return next(new AppError(403, "Only providers can access this"));
        }

        const availabilities = await this.availabilityService.getProviderAvailabilities(providerProfileId);

        res.status(200).json({
            status: "success",
            data: availabilities
        });
    };

    /**
     * Get a provider's public availabilities
     * GET /api/availability/provider/:providerId
     */
    getProviderAvailabilities = async (req: Request, res: Response, next: NextFunction) => {
        const providerId = Array.isArray(req.params.prroviderId) ? req.params.prroviderId[0] : req.params.prroviderId;

        if (!providerId) {
            return next(new AppError(400, "Provider ID is required"));
        }

        const availabilities = await this.availabilityService.getProviderAvailabilities(providerId);

        res.status(200).json({
            status: "success",
            data: availabilities
        });
    };

    /**
     * Delete a specific availability
     * DELETE /api/availability/:id
     */
    deleteAvailability = async (req: Request, res: Response, next: NextFunction) => {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { providerProfileId } = req.user as { providerProfileId?: string };

        if (!providerProfileId) {
            return next(new AppError(403, "Only providers can delete availability"));
        }

        const result = await this.availabilityService.deleteAvailability(id, providerProfileId, next);

        if (!result) return;

        res.status(200).json({
            status: "success",
            message: "Availability deleted successfully"
        });
    };
}

export default AvailabilityController;
