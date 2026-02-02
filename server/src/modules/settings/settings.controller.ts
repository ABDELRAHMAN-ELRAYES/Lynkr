import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import SettingsService from "./settings.service";

export const getSettings = catchAsync(
    async (_request: Request, response: Response, _next: NextFunction) => {
        const settings = await SettingsService.getSettings();
        response.status(200).json({ status: "success", data: { settings } });
    }
);

export const updateSettings = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const settings = await SettingsService.updateSettings(request.body, next);
        response.status(200).json({
            status: "success",
            message: "Settings updated successfully",
            data: { settings }
        });
    }
);
