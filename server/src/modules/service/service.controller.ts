import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import ServiceService from "./service.service";

export const createService = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const service = await ServiceService.createService(request.body, next);
        response.status(201).json({ status: "success", data: { service } });
    }
);

export const getAllServices = catchAsync(
    async (_request: Request, response: Response, _next: NextFunction) => {
        const services = await ServiceService.getAllServices();
        response.status(200).json({ status: "success", data: { services } });
    }
);

export const getService = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const service = await ServiceService.getServiceById(request.params.id, next);
        if (!service) return;
        response.status(200).json({ status: "success", data: { service } });
    }
);

export const updateService = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const service = await ServiceService.updateService(request.params.id, request.body, next);
        response.status(200).json({ status: "success", data: { service } });
    }
);

export const deleteService = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        await ServiceService.deleteService(request.params.id, next);
        response.status(204).json({ status: "success", data: null });
    }
);
