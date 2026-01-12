import MessageRepository from "./message.repository";
import ConversationService from "../conversation/conversation.service";
import NotificationService from "../../notification/notification.service";
import SocketService from "../../../services/socket.service";
import { NextFunction } from "express";
import AppError from "../../../utils/app-error";
import { ICreateMessageData } from "./types/IMessage";

const MAX_MESSAGE_LENGTH = 5000;

class MessageService {
    private static repository = MessageRepository.getInstance();
    private static socketService = SocketService.getInstance();

    static async createMessage(
        data: ICreateMessageData,
        next: NextFunction
    ) {
        // Validate required fields
        if (!data.conversationId) {
            return next(new AppError(400, "Conversation ID is required"));
        }
        if (!data.senderId) {
            return next(new AppError(400, "Sender ID is required"));
        }
        if (!data.content || data.content.trim().length === 0) {
            return next(new AppError(400, "Message content cannot be empty"));
        }
        if (data.content.length > MAX_MESSAGE_LENGTH) {
            return next(
                new AppError(400, `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`)
            );
        }

        // Verify sender is a participant in the conversation
        const isParticipant = await ConversationService.isUserParticipant(
            data.conversationId,
            data.senderId
        );

        if (!isParticipant) {
            return next(
                new AppError(403, "Not authorized to send messages in this conversation")
            );
        }

        const message = await this.repository.createMessage({
            ...data,
            content: data.content.trim(),
        });

        // Real-time: Broadcast message to conversation participants
        this.broadcastNewMessage(data.conversationId, message);

        // Trigger notification for recipient (fire and forget)
        this.triggerNewMessageNotification(data.conversationId, data.senderId, data.content);

        return message;
    }

    private static broadcastNewMessage(conversationId: string, message: any) {
        try {
            // Broadcast to conversation room and all participants' personal rooms
            this.socketService.broadcastNewMessage(conversationId, message);
        } catch (error) {
            console.error("Failed to broadcast message:", error);
        }
    }

    private static async triggerNewMessageNotification(
        conversationId: string,
        senderId: string,
        messageContent: string
    ) {
        try {
            // Get conversation participants to find recipient
            const participants = await ConversationService["repository"].getConversationParticipants(
                conversationId
            );
            const recipientId = participants.find((id: string) => id !== senderId);

            if (recipientId) {
                await NotificationService.createNotification({
                    userId: recipientId,
                    title: "New Message",
                    message: messageContent.substring(0, 100) + (messageContent.length > 100 ? "..." : ""),
                    type: "MESSAGE",
                });
            }
        } catch (error) {
            // Log but don't fail the message creation
            console.error("Failed to create notification:", error);
        }
    }

    static async getMessagesByConversationId(
        conversationId: string,
        userId: string,
        page: number,
        limit: number,
        next: NextFunction
    ) {
        if (!conversationId) {
            return next(new AppError(400, "Conversation ID is required"));
        }

        // Verify user is a participant
        const isParticipant = await ConversationService.isUserParticipant(
            conversationId,
            userId
        );

        if (!isParticipant) {
            return next(
                new AppError(403, "Not authorized to view messages in this conversation")
            );
        }

        return await this.repository.getMessagesByConversationId(
            conversationId,
            page,
            limit
        );
    }

    static async markMessageAsRead(
        messageId: string,
        userId: string,
        next: NextFunction
    ) {
        if (!messageId) {
            return next(new AppError(400, "Message ID is required"));
        }

        const message = await this.repository.getMessageById(messageId);

        if (!message) {
            return next(new AppError(404, "Message not found"));
        }

        // Verify user is a participant in the conversation
        const isParticipant = await ConversationService.isUserParticipant(
            message.conversationId,
            userId
        );

        if (!isParticipant) {
            return next(new AppError(403, "Not authorized to access this message"));
        }

        // Only mark as read if the user is not the sender
        if (message.senderId === userId) {
            return message; // Return unchanged if sender tries to mark their own message
        }

        const updatedMessage = await this.repository.markMessageAsRead(messageId);

        // Real-time: Broadcast read status to conversation
        try {
            this.socketService.broadcastMessageRead(message.conversationId, userId, [messageId]);
        } catch (error) {
            console.error("Failed to broadcast read status:", error);
        }

        return updatedMessage;
    }

    static async markConversationAsRead(
        conversationId: string,
        userId: string,
        next: NextFunction
    ) {
        if (!conversationId) {
            return next(new AppError(400, "Conversation ID is required"));
        }

        // Verify user is a participant
        const isParticipant = await ConversationService.isUserParticipant(
            conversationId,
            userId
        );

        if (!isParticipant) {
            return next(
                new AppError(403, "Not authorized to access this conversation")
            );
        }

        const result = await this.repository.markConversationMessagesAsRead(
            conversationId,
            userId
        );

        // Real-time: Broadcast that conversation was read
        try {
            const socketService = SocketService.getInstance();
            socketService.broadcastConversationRead(conversationId, userId);
        } catch (error) {
            console.error("Failed to broadcast conversation read:", error);
        }

        return result;
    }
}

export default MessageService;
