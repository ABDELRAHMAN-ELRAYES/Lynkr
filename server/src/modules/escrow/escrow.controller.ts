import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import EscrowService from "./escrow.service";

export const createEscrow = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const result = await EscrowService.createEscrow(request.body, next);
        response.status(201).json({ status: "success", data: result });
    }
);

export const getEscrowByProject = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const escrow = await EscrowService.getEscrowByProjectId(request.params.projectId, next);
        if (!escrow) return;
        response.status(200).json({ status: "success", data: { escrow } });
    }
);

export const releaseFunds = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { amount } = request.body;
        const escrow = await EscrowService.releaseFunds(request.params.id, amount, next);
        response.status(200).json({ status: "success", data: { escrow } });
    }
);

export const cancelEscrow = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const escrow = await EscrowService.cancelEscrow(request.params.id, next);
        response.status(200).json({ status: "success", data: { escrow } });
    }
);
