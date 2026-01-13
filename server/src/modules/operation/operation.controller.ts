import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import OperationService from "./operation.service";

export const createOperation = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const operation = await OperationService.createOperation(request.body, next);
        response.status(201).json({ status: "success", data: { operation } });
    }
);

export const getAllOperations = catchAsync(
    async (_request: Request, response: Response, _next: NextFunction) => {
        const operations = await OperationService.getAllOperations();
        response.status(200).json({ status: "success", data: { operations } });
    }
);

export const getOperation = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const operation = await OperationService.getOperationById(request.params.id, next);
        if (!operation) return;
        response.status(200).json({ status: "success", data: { operation } });
    }
);

export const updateOperation = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const operation = await OperationService.updateOperation(request.params.id, request.body, next);
        response.status(200).json({ status: "success", data: { operation } });
    }
);

export const deleteOperation = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        await OperationService.deleteOperation(request.params.id, next);
        response.status(204).json({ status: "success", data: null });
    }
);
