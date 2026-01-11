import { NextFunction, Request, Response } from "express";
import ProposalService from "./proposal.service";
import { ICreateProposalData } from "./types/IProposal";

export const createProposal = async (req: Request, res: Response, next: NextFunction) => {
    const proposalData: ICreateProposalData = {
        requestId: req.body.requestId,
        providerProfileId: "", // Will be filled by service from user ID
        price: Number(req.body.price),
        priceType: req.body.priceType,
        estimatedDays: Number(req.body.estimatedDays),
        notes: req.body.notes,
        files: req.files as Express.Multer.File[],
    };

    const newProposal = await ProposalService.createProposal((req.user as any).id, proposalData, next);

    if (newProposal) {
        return res.status(201).json({
            status: "success",
            data: newProposal,
        });
    }
};

export const getProposalsByRequest = async (req: Request, res: Response, next: NextFunction) => {
    const proposals = await ProposalService.getProposalsByRequestId(req.params.requestId, (req.user as any).id, next);
    if (proposals) {
        res.status(200).json({
            status: "success",
            data: proposals,
        });
    }
};

export const getProposal = async (req: Request, res: Response, next: NextFunction) => {
    const proposal = await ProposalService.getProposalById(req.params.id, (req.user as any).id, next);
    if (proposal) {
        res.status(200).json({
            status: "success",
            data: proposal,
        });
    }
};

export const acceptProposal = async (req: Request, res: Response, next: NextFunction) => {
    const proposal = await ProposalService.acceptProposal(req.params.id, (req.user as any).id, next);
    if (proposal) {
        res.status(200).json({
            status: "success",
            message: "Proposal accepted",
            data: proposal,
        });
    }
};

export const rejectProposal = async (req: Request, res: Response, next: NextFunction) => {
    const proposal = await ProposalService.rejectProposal(req.params.id, (req.user as any).id, next);
    if (proposal) {
        res.status(200).json({
            status: "success",
            message: "Proposal rejected",
            data: proposal,
        });
    }
};

export const updateProposal = async (req: Request, res: Response, next: NextFunction) => {
    const updateData = { ...req.body, files: req.files };
    const proposal = await ProposalService.updateProposal(req.params.id, updateData, (req.user as any).id, next);
    if (proposal) {
        res.status(200).json({
            status: "success",
            data: proposal,
        });
    }
};

export const deleteProposal = async (req: Request, res: Response, next: NextFunction) => {
    const result = await ProposalService.deleteProposal(req.params.id, (req.user as any).id, next);
    if (result) {
        res.status(204).json({
            status: "success",
            data: null,
        });
    }
};
