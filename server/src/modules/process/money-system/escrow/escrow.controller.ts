import { Request, Response, NextFunction } from "express";
import EscrowService from "./escrow.service";

export const getEscrowByProject = async (req: Request, res: Response, next: NextFunction) => {
    const escrow = await EscrowService.getEscrowByProjectId(req.params.projectId, next);

    if (escrow) {
        return res.status(200).json({
            status: "success",
            data: escrow
        });
    }
};

export const getProviderBalance = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if (!user.providerProfile) {
        return res.status(403).json({
            status: "error",
            message: "Only providers can view balance"
        });
    }

    const balance = await EscrowService.getProviderBalance(user.providerProfile.id, next);

    if (balance !== undefined) {
        return res.status(200).json({
            status: "success",
            data: { balance }
        });
    }
};

export const requestWithdrawal = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    const { amount } = req.body;

    if (!user.providerProfile) {
        return res.status(403).json({
            status: "error",
            message: "Only providers can request withdrawals"
        });
    }

    const result = await EscrowService.requestWithdrawal(
        user.providerProfile.id,
        amount,
        next
    );

    if (result) {
        return res.status(200).json({
            status: "success",
            data: result
        });
    }
};
