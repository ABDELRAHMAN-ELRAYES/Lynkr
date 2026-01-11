import PrismaClientSingleton from "../../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../../utils/app-error";

class ChatRepository {
    private prisma: PrismaClient;
    static instance: ChatRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): ChatRepository {
        if (!ChatRepository.instance) {
            ChatRepository.instance = new ChatRepository();
        }
        return ChatRepository.instance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    async createMessage(data: any): Promise<any> {
        try {
            return await this.prisma.message.create({ data: data as any });
        } catch (error) {
            throw new AppError(500, "Failed to create message");
        }
    }

    async getAllMessages(): Promise<any[]> {
        try {
            return await this.prisma.message.findMany({
                orderBy: { createdAt: "desc" },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get messages");
        }
    }

    async getMessageById(id: string): Promise<any> {
        try {
            return await this.prisma.message.findUnique({ where: { id } });
        } catch (error) {
            throw new AppError(500, "Failed to get message");
        }
    }

    async getConversation(userId1: string, userId2: string): Promise<any[]> {
        try {
            return await this.prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: userId1, receiverId: userId2 },
                        { senderId: userId2, receiverId: userId1 },
                    ],
                },
                orderBy: { createdAt: "asc" },
            });
        } catch (error) {
            throw new AppError(500, "Failed to get conversation");
        }
    }
}

export default ChatRepository;
