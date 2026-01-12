import PrismaClientSingleton from "../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../utils/app-error";
import { ICreateMessageData } from "./types/IMessage";

class MessageRepository {
    private prisma: PrismaClient;
    static instance: MessageRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): MessageRepository {
        if (!MessageRepository.instance) {
            MessageRepository.instance = new MessageRepository();
        }
        return MessageRepository.instance;
    }

    async createMessage(data: ICreateMessageData) {
        try {
            const message = await this.prisma.message.create({
                data: {
                    conversationId: data.conversationId,
                    senderId: data.senderId,
                    content: data.content,
                },
                include: {
                    sender: {
                        select: { id: true, firstName: true, lastName: true },
                    },
                },
            });

            // Update conversation's updatedAt timestamp
            await this.prisma.conversation.update({
                where: { id: data.conversationId },
                data: { updatedAt: new Date() },
            });

            return message;
        } catch (error) {
            throw new AppError(500, "Failed to create message");
        }
    }

    async getMessageById(id: string) {
        try {
            return await this.prisma.message.findUnique({
                where: { id },
                include: {
                    sender: {
                        select: { id: true, firstName: true, lastName: true },
                    },
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get message");
        }
    }

    async getMessagesByConversationId(
        conversationId: string,
        page: number = 1,
        limit: number = 50
    ) {
        try {
            const skip = (page - 1) * limit;

            const [messages, total] = await Promise.all([
                this.prisma.message.findMany({
                    where: { conversationId },
                    include: {
                        sender: {
                            select: { id: true, firstName: true, lastName: true },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    skip,
                    take: limit,
                }),
                this.prisma.message.count({
                    where: { conversationId },
                }),
            ]);

            return {
                messages: messages.reverse(), // Return in chronological order
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new AppError(500, "Failed to get messages");
        }
    }

    async markMessageAsRead(id: string) {
        try {
            return await this.prisma.message.update({
                where: { id },
                data: { isRead: true },
            });
        } catch (error) {
            throw new AppError(500, "Failed to mark message as read");
        }
    }

    async markConversationMessagesAsRead(conversationId: string, userId: string) {
        try {
            return await this.prisma.message.updateMany({
                where: {
                    conversationId,
                    senderId: { not: userId },
                    isRead: false,
                },
                data: { isRead: true },
            });
        } catch (error) {
            throw new AppError(500, "Failed to mark messages as read");
        }
    }
}

export default MessageRepository;
