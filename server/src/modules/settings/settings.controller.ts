import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import SettingsService from "./settings.service";

export const getAllSettings = catchAsync(
    async (_request: Request, response: Response, _next: NextFunction) => {
        const settings = await SettingsService.getAllSettings();
        response.status(200).json({ status: "success", data: { settings } });
    }
);

export const getSetting = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const setting = await SettingsService.getSettingById(request.params.id, next);
        if (!setting) return;
        response.status(200).json({ status: "success", data: { setting } });
    }
);

export const updateSetting = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const setting = await SettingsService.updateSetting(request.params.id, request.body, next);
        response.status(200).json({ status: "success", data: { setting } });
    }
);
