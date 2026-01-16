import { NextFunction } from "express";
import AppError from "../../../../utils/app-error";
import EscrowRepository from "./escrow.repository";
import NotificationService from "../../../notification/notification.service";

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
        userId: string,
        amount: number,
        next: NextFunction
    ) {
        try {
            // Validate amount
            if (amount <= 0) {
                return next(new AppError(400, "Withdrawal amount must be greater than 0"));
            }

            const balance = await this.escrowRepo.getProviderBalance(providerProfileId);

            if (Number(balance) < amount) {
                return next(new AppError(400, "Insufficient balance for withdrawal"));
            }

            // Minimum withdrawal check
            const MINIMUM_WITHDRAWAL = 10;
            if (amount < MINIMUM_WITHDRAWAL) {
                return next(new AppError(400, `Minimum withdrawal amount is $${MINIMUM_WITHDRAWAL}`));
            }

            // Create withdrawal record and deduct from balance
            const withdrawal = await this.escrowRepo.createWithdrawal(providerProfileId, amount);

            // Note: Actual Stripe Connect payout requires:
            // 1. Provider to have connected Stripe account
            // 2. Stripe Connect onboarding completed
            // For now, process withdrawal as PENDING for manual review
            // In production, this would trigger: stripe.transfers.create()

            // Notify provider
            await NotificationService.sendSystemNotification(
                userId,
                "Withdrawal Requested",
                `Your withdrawal of $${amount.toFixed(2)} has been submitted and is being processed.`
            );

            return withdrawal;
        } catch (error) {
            return next(new AppError(500, "Failed to process withdrawal"));
        }
    }

    static async getWithdrawalHistory(providerProfileId: string, next: NextFunction) {
        try {
            return await this.escrowRepo.getWithdrawalHistory(providerProfileId);
        } catch (error) {
            return next(new AppError(500, "Failed to get withdrawal history"));
        }
    }
}

export default EscrowService;
