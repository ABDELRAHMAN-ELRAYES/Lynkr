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
    const user = req.user as any;

    if (user.role === 'CLIENT') {
        const requests = await RequestService.getRequestsByClientId(user.id, next);
        return res.status(200).json({ status: "success", data: requests });
    } else if (user.role.startsWith('PROVIDER')) {
        // Need provider profile ID and service category
        const profile = await ProfileService.getProviderProfileByUserId(user.id, next);
        if (!profile) {
            return next(new AppError(404, "Provider profile not found"));
        }

        // Get provider's service category for filtering public requests
        const serviceCategory = profile.service?.name;

        // Return direct requests + public requests in provider's service category
        const requests = await RequestService.getRequestsForProvider(profile.id, serviceCategory, next);
        return res.status(200).json({ status: "success", data: requests });
    } else {
        // Admin or other
        // return all?
        return res.status(200).json({ status: "success", data: [] });
    }
};

/**
 * Get paginated public requests for providers
 */
export const getPublicRequests = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    // Only providers can access this endpoint
    if (!user.role.startsWith('PROVIDER')) {
        return next(new AppError(403, "Only providers can access public requests"));
    }

    // Get provider profile for category filtering
    const profile = await ProfileService.getProviderProfileByUserId(user.id, next);
    if (!profile) {
        return next(new AppError(404, "Provider profile not found"));
    }

    // Parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    // Default to provider's service category, but allow override
    const category = (req.query.category as string) || profile.service?.name;

    const result = await RequestService.getPublicRequests({
        page,
        limit,
        category,
        search,
    });

    return res.status(200).json({
        status: "success",
        data: result.requests,
        pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
        },
    });
};

export const getRequestById = async (req: Request, res: Response, next: NextFunction) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const request = await RequestService.getRequestById(id, req.user as any, next);
    if (request) {
        res.status(200).json({
            status: "success",
            data: request,
        });
    }
};

export const updateRequest = async (req: Request, res: Response, next: NextFunction) => {
    const updateData = { ...req.body, files: req.files };
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const updatedRequest = await RequestService.updateRequest(id, updateData, (req.user as any).id, next);
    if (updatedRequest) {
        res.status(200).json({
            status: "success",
            data: updatedRequest,
        });
    }
};

export const cancelRequest = async (req: Request, res: Response, next: NextFunction) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const request = await RequestService.cancelRequest(id, (req.user as any).id, next);
    if (request) {
        res.status(200).json({
            status: "success",
            data: request,
        });
    }
};

export const acceptRequest = async (req: Request, res: Response, next: NextFunction) => {

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const request = await RequestService.acceptRequest(id, (req.user as any).id, next);
    if (request) {
        return res.status(200).json({
            status: "success",
            data: request,
        });
    }

};

export const rejectRequest = async (req: Request, res: Response, next: NextFunction) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const request = await RequestService.rejectRequest(id, (req.user as any).id, next);
    if (request) {
        return res.status(200).json({
            status: "success",
            data: request,
        });
    }

};
