import http from "http";
import app from "./app";
import config from "./config/config";
import PrismaClientSingleton from "./data-server-clients/prisma-client";
import SocketService from "./services/socket.service";

const prisma = PrismaClientSingleton.getPrismaClient();

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.io
const socketService = SocketService.getInstance();
socketService.initialize(httpServer);

const PORT = config.port || 8080;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port [${PORT}]`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`WebSocket server initialized`);
});

// Graceful shutdown
const gracefulShutdown = async () => {
    console.log("Shutting down gracefully...");

    httpServer.close(() => {
        console.log("HTTP server closed");
    });

    await prisma.$disconnect();
    console.log("Database connection closed");

    process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
