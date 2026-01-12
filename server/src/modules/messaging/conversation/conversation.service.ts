import ConversationRepository from "./conversation.repository";
import { NextFunction } from "express";
import AppError from "../../../utils/app-error";
import { ICreateConversationData } from "./types/IConversation";

class ConversationService {
    private static repository = ConversationRepository.getInstance();

    static async createConversation(
        data: ICreateConversationData,
        next: NextFunction
    ) {
        // Validate required fields
        if (!data.projectId) {
            return next(new AppError(400, "Project ID is required"));
        }
        if (!data.participant1Id || !data.participant2Id) {
            return next(new AppError(400, "Both participants are required"));
        }
        if (data.participant1Id === data.participant2Id) {
            return next(new AppError(400, "Participants must be different users"));
        }

        return await this.repository.createConversation(data);
    }

    static async getConversationById(id: string, userId: string, next: NextFunction) {
        if (!id) {
            return next(new AppError(400, "Conversation ID is required"));
        }

        const conversation = await this.repository.getConversationById(id);

        if (!conversation) {
            return next(new AppError(404, "Conversation not found"));
        }

        // Verify user is a participant
        if (
            conversation.participant1Id !== userId &&
            conversation.participant2Id !== userId
        ) {
            return next(new AppError(403, "Not authorized to access this conversation"));
        }

        return conversation;
    }

    static async getConversationByProjectId(
        projectId: string,
        userId: string,
        next: NextFunction
    ) {
        if (!projectId) {
            return next(new AppError(400, "Project ID is required"));
        }

        const conversation = await this.repository.getConversationByProjectId(projectId);

        if (!conversation) {
            return next(new AppError(404, "Conversation not found for this project"));
        }

        // Verify user is a participant
        if (
            conversation.participant1Id !== userId &&
            conversation.participant2Id !== userId
        ) {
            return next(new AppError(403, "Not authorized to access this conversation"));
        }

        return conversation;
    }

    static async getUserConversations(userId: string, next: NextFunction) {
        if (!userId) {
            return next(new AppError(400, "User ID is required"));
        }

        return await this.repository.getUserConversations(userId);
    }

    static async isUserParticipant(
        conversationId: string,
        userId: string
    ): Promise<boolean> {
        const participants = await this.repository.getConversationParticipants(
            conversationId
        );
        return participants.includes(userId);
    }
}

export default ConversationService;
