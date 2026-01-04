import FileRepository from "./file.repository";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";

class FileService {
    private static repository = FileRepository.getInstance();

    static async saveFileRecord(data: any) {
        return await this.repository.saveFileRecord(data);
    }

    static async getFileById(id: string, next: NextFunction) {
        const file = await this.repository.getFileById(id);
        if (!file) {
            next(new AppError(404, "File not found"));
            return;
        }
        return file;
    }

    static async getAllFiles() {
        return await this.repository.getAllFiles();
    }

    static async deleteFile(id: string, next: NextFunction) {
        return await this.repository.deleteFile(id);
    }
}

export default FileService;
