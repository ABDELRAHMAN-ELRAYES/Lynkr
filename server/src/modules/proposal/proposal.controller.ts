import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import ProposalService from "./proposal.service";

export const createProposal = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const proposal = await ProposalService.createProposal(request.body, next);
        response.status(201).json({ status: "success", data: { proposal } });
    }
);

export const getProposalsByOrder = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const proposals = await ProposalService.getProposalsByOrderId(request.params.orderId);
        response.status(200).json({ status: "success", data: { proposals } });
    }
);

export const getProposal = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const proposal = await ProposalService.getProposalById(request.params.id, next);
        if (!proposal) return;
        response.status(200).json({ status: "success", data: { proposal } });
    }
);

export const acceptProposal = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const proposal = await ProposalService.acceptProposal(request.params.id, next);
        response.status(200).json({ status: "success", data: { proposal } });
    }
);

export const rejectProposal = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const proposal = await ProposalService.rejectProposal(request.params.id, next);
        response.status(200).json({ status: "success", data: { proposal } });
    }
);

export const updateProposal = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const proposal = await ProposalService.updateProposal(request.params.id, request.body, next);
        response.status(200).json({ status: "success", data: { proposal } });
    }
);

export const deleteProposal = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        await ProposalService.deleteProposal(request.params.id, next);
        response.status(204).json({ status: "success", data: null });
    }
);
