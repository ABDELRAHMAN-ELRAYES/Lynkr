import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../utils/catch-async";
import MessageService from "./message.service";

export const createMessage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { conversationId, content } = req.body;
        const senderId = (req.user as any).id;

        const message = await MessageService.createMessage(
            { conversationId, senderId, content },
            next
        );

        if (!message) return;

        res.status(201).json({
            status: "success",
            data: { message },
        });
    }
);

export const getMessagesByConversationId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { conversationId } = req.params;
        const userId = (req.user as any).id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        const result = await MessageService.getMessagesByConversationId(
            conversationId,
            userId,
            page,
            limit,
            next
        );

        if (!result) return;

        res.status(200).json({
            status: "success",
            data: result,
        });
    }
);

export const markMessageAsRead = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = (req.user as any).id;

        const message = await MessageService.markMessageAsRead(id, userId, next);

        if (!message) return;

        res.status(200).json({
            status: "success",
            data: { message },
        });
    }
);

export const markConversationAsRead = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { conversationId } = req.params;
        const userId = (req.user as any).id;

        const result = await MessageService.markConversationAsRead(
            conversationId,
            userId,
            next
        );

        if (!result) return;

        res.status(200).json({
            status: "success",
            message: "Messages marked as read",
            data: { count: result.count },
        });
    }
);
