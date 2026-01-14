import ServiceRepository from "./service.repository";
import { NextFunction } from "express";
import AppError from "../../utils/app-error";
import { ICreateServiceData, IUpdateServiceData, ICreateSkillData } from "./types/IService";

class ServiceService {
    private static serviceRepository = ServiceRepository.getInstance();

    // ===== SERVICE OPERATIONS =====

    static async createService(data: ICreateServiceData, next: NextFunction) {
        if (!data.name) {
            return next(new AppError(400, "Service name is required"));
        }
        return await this.serviceRepository.createService(data);
    }

    static async getAllServices(includeInactive: boolean = false) {
        return await this.serviceRepository.getAllServices(!includeInactive);
    }

    static async getServiceById(id: string, next: NextFunction) {
        const service = await this.serviceRepository.getServiceById(id);
        if (!service) {
            return next(new AppError(404, "Service not found"));
        }
        return service;
    }

    static async updateService(id: string, data: IUpdateServiceData, next: NextFunction) {
        const service = await this.serviceRepository.getServiceById(id);
        if (!service) {
            return next(new AppError(404, "Service not found"));
        }
        return await this.serviceRepository.updateService(id, data);
    }

    static async deleteService(id: string, next: NextFunction) {
        const service = await this.serviceRepository.getServiceById(id);
        if (!service) {
            return next(new AppError(404, "Service not found"));
        }
        return await this.serviceRepository.deleteService(id);
    }

    // ===== SKILL OPERATIONS =====

    static async createSkill(data: ICreateSkillData, next: NextFunction) {
        if (!data.name || !data.serviceId) {
            return next(new AppError(400, "Skill name and service ID are required"));
        }

        const service = await this.serviceRepository.getServiceById(data.serviceId);
        if (!service) {
            return next(new AppError(404, "Service not found"));
        }

        return await this.serviceRepository.createSkill(data);
    }

    static async getSkillsByServiceId(serviceId: string, next: NextFunction) {
        const service = await this.serviceRepository.getServiceById(serviceId);
        if (!service) {
            return next(new AppError(404, "Service not found"));
        }
        return await this.serviceRepository.getSkillsByServiceId(serviceId);
    }

    static async deleteSkill(id: string, _next: NextFunction) {
        return await this.serviceRepository.deleteSkill(id);
    }
}

export default ServiceService;
