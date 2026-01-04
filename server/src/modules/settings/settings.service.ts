import SettingsRepository from "./settings.repository";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";

class SettingsService {
    private static repository = SettingsRepository.getInstance();

    static async getAllSettings() {
        return await this.repository.getAllSettings();
    }

    static async getSettingById(id: string, next: NextFunction) {
        const setting = await this.repository.getSettingById(id);
        if (!setting) {
            next(new AppError(404, "Setting not found"));
            return;
        }
        return setting;
    }

    static async updateSetting(id: string, data: any, next: NextFunction) {
        return await this.repository.updateSetting(id, data);
    }
}

export default SettingsService;
