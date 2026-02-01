// Load .env file FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import http from "http";
import app from "./app";
import config from "./config/config";
import PrismaClientSingleton from "./data-server-clients/prisma-client";
import SocketService from "./services/socket.service";
import { startAutoPublishJob } from "./jobs/auto-publish-requests.job";
import { startSubscriptionJob } from "./jobs/subscription.job";

const prisma = PrismaClientSingleton.getPrismaClient();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
SocketService.getInstance().initialize(server);

const PORT = config.port;

server.listen(PORT, () => {
    console.log(`Server is running on port [${PORT}]`);
    console.log(`Environment: ${config.env}`);
    console.log(`WebSocket server initialized`);

    // Start scheduled jobs
    startAutoPublishJob();
    startSubscriptionJob();
});

// Graceful shutdown
const gracefulShutdown = async () => {
    console.log("Shutting down gracefully...");

    server.close(() => {
        console.log("HTTP server closed");
    });

    await prisma.$disconnect();
    console.log("Database connection closed");

    process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
