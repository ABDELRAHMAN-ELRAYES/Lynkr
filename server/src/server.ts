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
import { seedDatabase } from './data-server-clients/seed';

const prisma = PrismaClientSingleton.getPrismaClient();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
SocketService.getInstance().initialize(server);

const PORT = config.port;

server.listen(PORT, async () => {
    console.log(`Server is running on port [${PORT}]`);
    console.log(`Environment: ${config.env}`);
    console.log(`WebSocket server initialized`);

    // Seed database with services and default settings
    try {
        await seedDatabase();
    } catch (error) {
        console.error('Failed to seed database:', error);
    }

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
