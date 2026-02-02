import SettingsRepository from "./settings.repository";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";
import { Setting } from "@prisma/client";
import { UpdateSettingsData } from "./types/ISettings";



class SettingsService {
    private static repository = SettingsRepository.getInstance();

    static async getSettings(): Promise<Setting> {
        const settings = await this.repository.getSettings();
        if (!settings) {
            throw new AppError(404, "Settings not found");
        }
        return settings;
    }

    static async updateSettings(data: UpdateSettingsData, next: NextFunction): Promise<Setting> {
        // Validate commission rate (0-100%)
        if (data.platformCommission !== undefined) {
            if (data.platformCommission < 0 || data.platformCommission > 100) {
                next(new AppError(400, "Platform commission must be between 0 and 100"));
                throw new Error(); // Stop execution
            }
        }

        // Validate minimum withdrawal (>= 0)
        if (data.minWithdrawal !== undefined) {
            if (data.minWithdrawal < 0) {
                next(new AppError(400, "Minimum withdrawal must be greater than or equal to 0"));
                throw new Error(); // Stop execution
            }
        }

        return await this.repository.updateSettings(data);
    }

    static async getPlatformCommissionRate(): Promise<number> {
        return await this.repository.getPlatformCommissionRate();
    }


}

export default SettingsService;
