import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { verifyJWT } from "../utils/jwt-handler";

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

        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error"));
            }

            try {
                const decoded = verifyJWT(token);
                if (!decoded || !decoded.id) {
                    return next(new Error("Invalid token"));
                }

                (socket as any).userId = decoded.id;
                next();
            } catch (error) {
                return next(new Error("Authentication failed"));
            }
        });

        this.io.on("connection", (socket: Socket) => {
            const userId = (socket as any).userId;
            console.log(`User connected: ${userId}`);

            // Join user's personal room
            socket.join(`user:${userId}`);

            // Handle chat messages
            socket.on("chat:message", (data) => {
                this.handleChatMessage(socket, data);
            });

            // Handle typing indicators
            socket.on("chat:typing", (data) => {
                this.handleTyping(socket, data);
            });

            // Handle project room joining
            socket.on("project:join", (projectId) => {
                socket.join(`project:${projectId}`);
            });

            // Handle project room leaving
            socket.on("project:leave", (projectId) => {
                socket.leave(`project:${projectId}`);
            });

            socket.on("disconnect", () => {
                console.log(`User disconnected: ${userId}`);
            });
        });
    }

    private handleChatMessage(socket: Socket, data: any): void {
        const { receiverId, projectId, message } = data;
        const senderId = (socket as any).userId;

        // Broadcast to receiver
        if (receiverId) {
            this.io?.to(`user:${receiverId}`).emit("chat:message", {
                senderId,
                message,
                timestamp: new Date(),
            });
        }

        // Broadcast to project room
        if (projectId) {
            socket.to(`project:${projectId}`).emit("chat:message", {
                senderId,
                message,
                timestamp: new Date(),
            });
        }
    }

    private handleTyping(socket: Socket, data: any): void {
        const { receiverId, projectId, isTyping } = data;
        const senderId = (socket as any).userId;

        if (receiverId) {
            this.io?.to(`user:${receiverId}`).emit("chat:typing", {
                senderId,
                isTyping,
            });
        }

        if (projectId) {
            socket.to(`project:${projectId}`).emit("chat:typing", {
                senderId,
                isTyping,
            });
        }
    }

    // Send notification to specific user
    sendNotification(userId: string, notification: any): void {
        this.io?.to(`user:${userId}`).emit("notification", notification);
    }

    // Broadcast to project room
    broadcastToProject(projectId: string, event: string, data: any): void {
        this.io?.to(`project:${projectId}`).emit(event, data);
    }

    // Send to specific user
    sendToUser(userId: string, event: string, data: any): void {
        this.io?.to(`user:${userId}`).emit(event, data);
    }

    getIO(): SocketIOServer | null {
        return this.io;
    }
}

export default SocketService;
