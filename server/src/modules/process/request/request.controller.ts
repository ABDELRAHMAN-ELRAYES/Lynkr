import { NextFunction, Request, Response } from "express";
import RequestService from "./request.service";
import { ICreateRequestData } from "./types/IRequest";
import ProfileService from "../../provider/profile/profile.service";
import AppError from "@/utils/app-error";

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
    // Files are handled by multer middleware and available in req.files
    const files = req.files as Express.Multer.File[];

    // Parse the operation JSON if it comes as a string (from FormData)
    let bodyData = req.body;
    if (req.body.operation && typeof req.body.operation === 'string') {
        try {
            bodyData = JSON.parse(req.body.operation);
        } catch (e) {
            return next(new AppError(400, "Invalid operation data format"));
        }
    } else if (req.body.operation) {
        bodyData = req.body.operation;
    }

    const requestData: ICreateRequestData = {
        clientId: (req.user as any).id,
        targetProviderId: bodyData.providerId, // Client sends providerId (uuid) if direct
        title: bodyData.title,
        description: bodyData.description,
        category: bodyData.category,
        budgetType: bodyData.budgetType,
        budgetCurrency: bodyData.budgetCurrency,
        fromBudget: bodyData.fromBudget ? Number(bodyData.fromBudget) : undefined,
        toBudget: bodyData.toBudget ? Number(bodyData.toBudget) : undefined,
        deadline: bodyData.deadline,
        ndaRequired: bodyData.ndaChecked || false,
        files: files,
    };

    const newRequest = await RequestService.createRequest(requestData, next);

    if (newRequest) {
        return res.status(201).json({
            status: "success",
            data: newRequest,
        });
    }
};

export const getRequests = async (req: Request, res: Response, next: NextFunction) => {
    // If client -> get own requests
    // If provider -> get direct + public requests matching categories

    // Check if user is acting as client or provider?
    // For now, based on role/context. 
    // Simplified: Return client requests if role is CLIENT, Provider requests if PROVIDER.

    // Note: A user can be both. We might need a query param ?view=client or provider.
    // Defaulting to filtering by createdBy (client) if no param.

    const user = req.user as any;

    if (user.role === 'CLIENT') {
        const requests = await RequestService.getRequestsByClientId(user.id, next);
        return res.status(200).json({ status: "success", data: requests });
    } else if (user.role.startsWith('PROVIDER')) {
        // Need provider profile ID
        const profile = await ProfileService.getProviderProfileByUserId(user.id, next);
        if (!profile) {
            return next(new AppError(404, "Provider profile not found"));
        }

        // Extract category from profile service (single service)
        const categories = profile.service ? [profile.service.name] : [];

        const requests = await RequestService.getRequestsForProvider(profile.id, categories, next);
        return res.status(200).json({ status: "success", data: requests });
    } else {
        // Admin or other
        // return all?
        return res.status(200).json({ status: "success", data: [] });
    }
};

export const getRequestById = async (req: Request, res: Response, next: NextFunction) => {
    const request = await RequestService.getRequestById(req.params.id, req.user as any, next);
    if (request) {
        res.status(200).json({
            status: "success",
            data: request,
        });
    }
};

export const updateRequest = async (req: Request, res: Response, next: NextFunction) => {
    const updateData = { ...req.body, files: req.files };
    const updatedRequest = await RequestService.updateRequest(req.params.id, updateData, (req.user as any).id, next);
    if (updatedRequest) {
        res.status(200).json({
            status: "success",
            data: updatedRequest,
        });
    }
};

export const cancelRequest = async (req: Request, res: Response, next: NextFunction) => {
    const request = await RequestService.cancelRequest(req.params.id, (req.user as any).id, next);
    if (request) {
        res.status(200).json({
            status: "success",
            data: request,
        });
    }
};
