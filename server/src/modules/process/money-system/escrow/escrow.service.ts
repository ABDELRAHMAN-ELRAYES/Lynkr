import { NextFunction } from "express";
import AppError from "../../../../utils/app-error";
import EscrowRepository from "./escrow.repository";

class EscrowService {
    private static escrowRepo = EscrowRepository.getInstance();

    static async getEscrowByProjectId(projectId: string, next: NextFunction) {
        try {
            const escrow = await this.escrowRepo.getEscrowByProjectId(projectId);
            if (!escrow) {
                return next(new AppError(404, "Escrow not found for this project"));
            }
            return escrow;
        } catch (error) {
            return next(new AppError(500, "Failed to get escrow"));
        }
    }

    static async getProviderBalance(providerProfileId: string, next: NextFunction) {
        try {
            return await this.escrowRepo.getProviderBalance(providerProfileId);
        } catch (error) {
            return next(new AppError(500, "Failed to get balance"));
        }
    }

    static async requestWithdrawal(
        providerProfileId: string,
        amount: number,
        next: NextFunction
    ) {
        try {
            const balance = await this.escrowRepo.getProviderBalance(providerProfileId);

            if (Number(balance) < amount) {
                return next(new AppError(400, "Insufficient balance for withdrawal"));
            }

            // TODO: Implement actual withdrawal via Stripe Connect or similar
            // For now, just log the request

            return {
                message: "Withdrawal request submitted",
                amount,
                status: "PENDING"
            };
        } catch (error) {
            return next(new AppError(500, "Failed to process withdrawal"));
        }
    }
}

export default EscrowService;
