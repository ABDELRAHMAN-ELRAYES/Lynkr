import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient, Setting } from "@prisma/client";
import AppError from "../../utils/app-error";
import { UpdateSettingsData } from "./types/ISettings";


class SettingsRepository {
    private prisma: PrismaClient;
    static instance: SettingsRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): SettingsRepository {
        if (!SettingsRepository.instance) {
            SettingsRepository.instance = new SettingsRepository();
        }
        return SettingsRepository.instance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    async getSettings(): Promise<Setting | null> {
        // Get the first (and only) settings row
        return await this.prisma.setting.findFirst();
    }

    async updateSettings(data: UpdateSettingsData): Promise<Setting> {
        // Get existing settings
        const existing = await this.getSettings();

        if (!existing) {
            throw new AppError(404, "Settings not found. Please initialize settings first.");
        }

        // Update the settings
        return await this.prisma.setting.update({
            where: { id: existing.id },
            data,
        });
    }

    async initializeDefaultSettings(): Promise<Setting> {
        // Check if settings already exist
        const existing = await this.getSettings();
        if (existing) {
            return existing;
        }

        // Create default settings
        return await this.prisma.setting.create({
            data: {
                platformName: 'Lynkr',
                platformCommission: 15,
                minWithdrawal: 10,
            },
        });
    }

    async getPlatformCommissionRate(): Promise<number> {
        const settings = await this.getSettings();
        if (!settings) {
            throw new AppError(500, "Platform settings not initialized");
        }
        return Number(settings.platformCommission);
    }
}

export default SettingsRepository;
