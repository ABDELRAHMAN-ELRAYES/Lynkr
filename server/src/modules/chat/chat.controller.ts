import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catch-async";
import ChatService from "./chat.service";

export const createMessage = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const message = await ChatService.createMessage(request.body, next);
        response.status(201).json({ status: "success", data: { message } });
    }
);

export const getAllMessages = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const messages = await ChatService.getAllMessages();
        response.status(200).json({ status: "success", data: { messages } });
    }
);

export const getMessage = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const message = await ChatService.getMessageById(request.params.id, next);
        if (!message) return;
        response.status(200).json({ status: "success", data: { message } });
    }
);

export const getConversation = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const { userId1, userId2 } = request.params;
        const messages = await ChatService.getConversation(userId1, userId2);
        response.status(200).json({ status: "success", data: { messages } });
    }
);
