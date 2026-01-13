import { Request, Response, NextFunction } from "express";
import SessionService from "./session.service";
import { catchAsync } from "../../../utils/catch-async";

class SessionController {
    static bookSession = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id;
        const { slotId } = req.body;

        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        if (!slotId) {
            res.status(400).json({ message: "Slot ID is required" });
            return;
        }

        const result = await SessionService.bookSession(userId, slotId, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static confirmBooking = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id;
        const { slotId, paymentId } = req.body;

        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const result = await SessionService.confirmBooking(userId, slotId, paymentId, next);

        if (result) {
            res.status(201).json({
                status: "success",
                data: result
            });
        }
    });

    static getMySessions = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const result = await SessionService.getMySessions(userId, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static getInstructorSessions = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const result = await SessionService.getInstructorSessions(userId, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static getSessionById = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const result = await SessionService.getSessionById(id, userId, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static startSession = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const result = await SessionService.startSession(id, userId, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static completeSession = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const result = await SessionService.completeSession(id, userId, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static cancelSession = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const result = await SessionService.cancelSession(id, userId, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static joinSession = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const result = await SessionService.joinSession(id, userId, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });

    static leaveSession = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user?.id;
        const { id } = req.params;

        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }

        const result = await SessionService.leaveSession(id, userId, next);

        if (result) {
            res.status(200).json({
                status: "success",
                data: result
            });
        }
    });
}

export default SessionController;
