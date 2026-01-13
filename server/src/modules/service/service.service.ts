import ServiceRepository from "./service.repository";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";

class ServiceService {
    private static serviceRepository = ServiceRepository.getInstance();

    static async createService(data: object, _next: NextFunction) {
        return await this.serviceRepository.createService(data);
    }

    static async getAllServices() {
        return await this.serviceRepository.getAllServices();
    }

    static async getServiceById(id: string, next: NextFunction) {
        const service = await this.serviceRepository.getServiceById(id);
        if (!service) {
            next(new AppError(404, "Service not found"));
            return;
        }
        return service;
    }

    static async updateService(id: string, data: object, _next: NextFunction) {
        return await this.serviceRepository.updateService(id, data);
    }

    static async deleteService(id: string, _next: NextFunction) {
        return await this.serviceRepository.deleteService(id);
    }
}

export default ServiceService;
