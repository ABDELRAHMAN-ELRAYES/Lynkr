import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../utils/catch-async";
import ConversationService from "./conversation.service";

export const getUserConversations = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req.user as any).id;

        const conversations = await ConversationService.getUserConversations(
            userId,
            next
        );

        if (!conversations) return;

        res.status(200).json({
            status: "success",
            data: { conversations },
        });
    }
);

export const getConversationById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const userId = (req.user as any).id;

        const conversation = await ConversationService.getConversationById(
            id,
            userId,
            next
        );

        if (!conversation) return;

        res.status(200).json({
            status: "success",
            data: { conversation },
        });
    }
);

export const getConversationByProjectId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { projectId } = req.params;
        const userId = (req.user as any).id;

        const conversation = await ConversationService.getConversationByProjectId(
            projectId,
            userId,
            next
        );

        if (!conversation) return;

        res.status(200).json({
            status: "success",
            data: { conversation },
        });
    }
);

export const createConversation = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { projectId, participant1Id, participant2Id } = req.body;

        const conversation = await ConversationService.createConversation(
            { projectId, participant1Id, participant2Id },
            next
        );

        if (!conversation) return;

        res.status(201).json({
            status: "success",
            data: { conversation },
        });
    }
);
