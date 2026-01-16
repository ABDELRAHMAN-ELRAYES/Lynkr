import { Request, Response, NextFunction } from "express";
import EscrowService from "./escrow.service";

export const getEscrowByProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const escrow = await EscrowService.getEscrowByProjectId(req.params.projectId, next);

    if (escrow) {
        res.status(200).json({
            status: "success",
            data: escrow
        });
    }
};

export const getProviderBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as any;

    if (!user.providerProfile) {
        res.status(403).json({
            status: "error",
            message: "Only providers can view balance"
        });
        return;
    }

    const balance = await EscrowService.getProviderBalance(user.providerProfile.id, next);

    if (balance !== undefined) {
        res.status(200).json({
            status: "success",
            data: { balance }
        });
    }
};

export const requestWithdrawal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as any;
    const { amount } = req.body;

    if (!user.providerProfile) {
        res.status(403).json({
            status: "error",
            message: "Only providers can request withdrawals"
        });
        return;
    }

    const result = await EscrowService.requestWithdrawal(
        user.providerProfile.id,
        user.id,
        amount,
        next
    );

    if (result) {
        res.status(200).json({
            status: "success",
            data: result
        });
    }
};
