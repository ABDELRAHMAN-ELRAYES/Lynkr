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

    // TODO: Add Settings model to Prisma schema
    async getAllSettings(): Promise<object[]> {
        throw new AppError(501, "Settings module not implemented");
    }

    async getSettingById(_id: string): Promise<object | null> {
        throw new AppError(501, "Settings module not implemented");
    }

    async updateSetting(_id: string, _data: object): Promise<object> {
        throw new AppError(501, "Settings module not implemented");
    }
}

export default SettingsRepository;
