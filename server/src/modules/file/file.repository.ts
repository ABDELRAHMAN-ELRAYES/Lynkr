import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";

class FileRepository {
    private prisma: PrismaClient;
    static instance: FileRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): FileRepository {
        if (!FileRepository.instance) {
            FileRepository.instance = new FileRepository();
        }
        return FileRepository.instance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    async saveFileRecord(data: any): Promise<any> {
        try {
            return await this.prisma.file.create({ data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to save file record");
        }
    }

    async getFileById(id: string): Promise<any> {
        try {
            return await this.prisma.file.findUnique({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to get file");
        }
    }

    async getAllFiles(): Promise<any[]> {
        try {
            return await this.prisma.file.findMany();
        } catch (error) {
            throw new AppError(500, "Failed to get files");
        }
    }

    async deleteFile(id: string): Promise<any> {
        try {
            return await this.prisma.file.delete({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to delete file");
        }
    }
}

export default FileRepository;
