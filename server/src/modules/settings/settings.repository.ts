import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";

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

    async getAllSettings(): Promise<any[]> {
        try {
            return await this.prisma.settings.findMany();
        } catch (error) {
            throw new AppError(500, "Failed to get settings");
        }
    }

    async getSettingById(id: string): Promise<any> {
        try {
            return await this.prisma.settings.findUnique({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to get setting");
        }
    }

    async updateSetting(id: string, data: any): Promise<any> {
        try {
            return await this.prisma.settings.update({ where: { id }, data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to update setting");
        }
    }
}

export default SettingsRepository;
