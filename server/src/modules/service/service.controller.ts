import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import ServiceService from "./service.service";

// ===== SERVICE ENDPOINTS =====

// Get all services
export const getAllServices = catchAsync(
    async (request: Request, response: Response, _next: NextFunction) => {
        const includeInactive = request.query.includeInactive === "true";
        const services = await ServiceService.getAllServices(includeInactive);

        response.status(200).json({
            status: "success",
            results: services.length,
            data: { services }
        });
    }
);

// Get service by ID
export const getService = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const service = await ServiceService.getServiceById(request.params.id, next);
        if (!service) return;

        response.status(200).json({
            status: "success",
            data: { service }
        });
    }
);

// Create service (admin)
export const createService = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const service = await ServiceService.createService(request.body, next);
        if (!service) return;

        response.status(201).json({
            status: "success",
            message: "Service created successfully",
            data: { service }
        });
    }
);

// Update service (admin)
export const updateService = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const service = await ServiceService.updateService(
            request.params.id,
            request.body,
            next
        );
        if (!service) return;

        response.status(200).json({
            status: "success",
            message: "Service updated successfully",
            data: { service }
        });
    }
);

// Delete service (admin)
export const deleteService = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        await ServiceService.deleteService(request.params.id, next);

        response.status(200).json({
            status: "success",
            message: "Service deactivated successfully"
        });
    }
);

// ===== SKILL ENDPOINTS =====

// Get skills by service ID
export const getSkillsByService = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const skills = await ServiceService.getSkillsByServiceId(
            request.params.id,
            next
        );
        if (!skills) return;

        response.status(200).json({
            status: "success",
            results: skills.length,
            data: { skills }
        });
    }
);

// Create skill (admin)
export const createSkill = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const skill = await ServiceService.createSkill(
            { ...request.body, serviceId: request.params.id },
            next
        );
        if (!skill) return;

        response.status(201).json({
            status: "success",
            message: "Skill created successfully",
            data: { skill }
        });
    }
);

// Delete skill (admin)
export const deleteSkill = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        await ServiceService.deleteSkill(request.params.skillId, next);

        response.status(200).json({
            status: "success",
            message: "Skill deactivated successfully"
        });
    }
);
