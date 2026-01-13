import OperationRepository from "./operation.repository";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";

class OperationService {
    private static repository = OperationRepository.getInstance();

    static async createOperation(data: object, _next: NextFunction) {
        return await this.repository.createOperation(data);
    }

    static async getAllOperations() {
        return await this.repository.getAllOperations();
    }

    static async getOperationById(id: string, next: NextFunction) {
        const operation = await this.repository.getOperationById(id);
        if (!operation) {
            next(new AppError(404, "Operation not found"));
            return;
        }
        return operation;
    }

    static async updateOperation(id: string, data: object, _next: NextFunction) {
        return await this.repository.updateOperation(id, data);
    }

    static async deleteOperation(id: string, _next: NextFunction) {
        return await this.repository.deleteOperation(id);
    }
}

export default OperationService;
