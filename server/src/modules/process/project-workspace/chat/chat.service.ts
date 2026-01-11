import ChatRepository from "./chat.repository";
import { NextFunction } from "express";
import AppError from "../../../../utils/app-error";

class ChatService {
    private static repository = ChatRepository.getInstance();

    static async createMessage(data: any, next: NextFunction) {
        return await this.repository.createMessage(data);
    }

    static async getAllMessages() {
        return await this.repository.getAllMessages();
    }

    static async getMessageById(id: string, next: NextFunction) {
        const message = await this.repository.getMessageById(id);
        if (!message) {
            next(new AppError(404, "Message not found"));
            return;
        }
        return message;
    }

    static async getConversation(userId1: string, userId2: string) {
        return await this.repository.getConversation(userId1, userId2);
    }
}

export default ChatService;
