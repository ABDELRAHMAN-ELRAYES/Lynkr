import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { verifyJWT } from "../utils/jwt";
import AppError from "../utils/app-error";

class SocketService {
    private io: SocketIOServer | null = null;
    private static instance: SocketService;

    private constructor() { }

    static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    initialize(httpServer: HTTPServer): void {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: process.env.CORS_ORIGIN || "*",
                credentials: true,
            },
        });

        // JWT Authentication middleware
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new AppError(401, "Authentication error"));
            }

            try {
                const decoded = verifyJWT(token);
                if (!decoded || !decoded.id) {
                    return next(new AppError(401, "Invalid token"));
                }

                (socket as any).userId = decoded.id;
                next();
            } catch (error) {
                return next(new AppError(401, "Authentication failed"));
            }
        });

        this.io.on("connection", (socket: Socket) => {
            const userId = (socket as any).userId;
            console.log(`User connected: ${userId}`);

            // Join user's personal room for direct messages
            socket.join(`user:${userId}`);

            // ============================================
            // Conversation Events
            // ============================================

            // Join a conversation room
            socket.on("conversation:join", (conversationId: string) => {
                socket.join(`conversation:${conversationId}`);
                console.log(`User ${userId} joined conversation ${conversationId}`);
            });

            // Leave a conversation room
            socket.on("conversation:leave", (conversationId: string) => {
                socket.leave(`conversation:${conversationId}`);
            });

            // Typing indicator
            socket.on("conversation:typing", (data: { conversationId: string; isTyping: boolean }) => {
                socket.to(`conversation:${data.conversationId}`).emit("conversation:typing", {
                    userId,
                    isTyping: data.isTyping,
                });
            });

            // Mark messages as read (client tells server they've read messages)
            socket.on("conversation:markRead", (data: { conversationId: string }) => {
                // Broadcast to other participant that messages were read
                socket.to(`conversation:${data.conversationId}`).emit("conversation:read", {
                    userId,
                    conversationId: data.conversationId,
                    readAt: new Date(),
                });
            });

            // ============================================
            // Project Events
            // ============================================

            socket.on("project:join", (projectId: string) => {
                socket.join(`project:${projectId}`);
            });

            socket.on("project:leave", (projectId: string) => {
                socket.leave(`project:${projectId}`);
            });

            // ============================================
            // Disconnect
            // ============================================

            socket.on("disconnect", () => {
                console.log(`User disconnected: ${userId}`);
            });
        });
    }

    // ============================================
    // Emit Methods (called from services)
    // ============================================

    // Send to specific user
    sendToUser(userId: string, event: string, data: any): void {
        this.io?.to(`user:${userId}`).emit(event, data);
    }

    // Broadcast to conversation room
    broadcastToConversation(conversationId: string, event: string, data: any): void {
        this.io?.to(`conversation:${conversationId}`).emit(event, data);
    }

    // Broadcast to project room
    broadcastToProject(projectId: string, event: string, data: any): void {
        this.io?.to(`project:${projectId}`).emit(event, data);
    }

    // Send notification
    sendNotification(userId: string, notification: any): void {
        this.io?.to(`user:${userId}`).emit("notification", notification);
    }

    // ============================================
    // Message-specific methods
    // ============================================

    // Broadcast new message to conversation participants
    broadcastNewMessage(conversationId: string, message: any): void {
        this.io?.to(`conversation:${conversationId}`).emit("message:new", {
            conversationId,
            message,
        });
    }

    // Broadcast message read status
    broadcastMessageRead(conversationId: string, userId: string, messageIds: string[]): void {
        this.io?.to(`conversation:${conversationId}`).emit("message:read", {
            conversationId,
            userId,
            messageIds,
            readAt: new Date(),
        });
    }

    // Broadcast all messages in conversation marked as read
    broadcastConversationRead(conversationId: string, userId: string): void {
        this.io?.to(`conversation:${conversationId}`).emit("conversation:read", {
            conversationId,
            userId,
            readAt: new Date(),
        });
    }

    getIO(): SocketIOServer | null {
        return this.io;
    }
}

export default SocketService;
