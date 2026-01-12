import PrismaClientSingleton from "../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../utils/app-error";
import { ICreateConversationData } from "./types/IConversation";

class ConversationRepository {
    private prisma: PrismaClient;
    static instance: ConversationRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): ConversationRepository {
        if (!ConversationRepository.instance) {
            ConversationRepository.instance = new ConversationRepository();
        }
        return ConversationRepository.instance;
    }

    async createConversation(data: ICreateConversationData) {
        try {
            return await this.prisma.conversation.create({
                data: {
                    projectId: data.projectId,
                    participant1Id: data.participant1Id,
                    participant2Id: data.participant2Id,
                },
                include: {
                    participant1: {
                        select: { id: true, firstName: true, lastName: true },
                    },
                    participant2: {
                        select: { id: true, firstName: true, lastName: true },
                    },
                    project: {
                        select: { id: true, status: true },
                    },
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to create conversation");
        }
    }

    async getConversationById(id: string) {
        try {
            return await this.prisma.conversation.findUnique({
                where: { id },
                include: {
                    participant1: {
                        select: { id: true, firstName: true, lastName: true },
                    },
                    participant2: {
                        select: { id: true, firstName: true, lastName: true },
                    },
                    project: {
                        select: { id: true, status: true },
                    },
                    messages: {
                        orderBy: { createdAt: "desc" },
                        take: 50,
                        include: {
                            sender: {
                                select: { id: true, firstName: true, lastName: true },
                            },
                        },
                    },
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get conversation");
        }
    }

    async getConversationByProjectId(projectId: string) {
        try {
            return await this.prisma.conversation.findUnique({
                where: { projectId },
                include: {
                    participant1: {
                        select: { id: true, firstName: true, lastName: true },
                    },
                    participant2: {
                        select: { id: true, firstName: true, lastName: true },
                    },
                    project: {
                        select: { id: true, status: true },
                    },
                },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get conversation by project");
        }
    }

    async getUserConversations(userId: string) {
        try {
            const conversations = await this.prisma.conversation.findMany({
                where: {
                    OR: [
                        { participant1Id: userId },
                        { participant2Id: userId },
                    ],
                },
                include: {
                    participant1: {
                        select: { id: true, firstName: true, lastName: true },
                    },
                    participant2: {
                        select: { id: true, firstName: true, lastName: true },
                    },
                    project: {
                        select: { id: true, status: true },
                    },
                    messages: {
                        orderBy: { createdAt: "desc" },
                        take: 1,
                        select: {
                            content: true,
                            createdAt: true,
                            senderId: true,
                        },
                    },
                },
                orderBy: { updatedAt: "desc" },
            });

            // Add unread count and format last message
            const conversationsWithUnread = await Promise.all(
                conversations.map(async (conv) => {
                    const unreadCount = await this.prisma.message.count({
                        where: {
                            conversationId: conv.id,
                            senderId: { not: userId },
                            isRead: false,
                        },
                    });

                    return {
                        ...conv,
                        lastMessage: conv.messages[0] || null,
                        unreadCount,
                        messages: undefined, // Remove messages array from response
                    };
                })
            );

            return conversationsWithUnread;
        } catch (error) {
            throw new AppError(500, "Failed to get user conversations");
        }
    }

    async getConversationParticipants(conversationId: string) {
        try {
            const conversation = await this.prisma.conversation.findUnique({
                where: { id: conversationId },
                select: {
                    participant1Id: true,
                    participant2Id: true,
                },
            });
            return conversation
                ? [conversation.participant1Id, conversation.participant2Id]
                : [];
        } catch (error) {
            throw new AppError(500, "Failed to get conversation participants");
        }
    }
}

export default ConversationRepository;
