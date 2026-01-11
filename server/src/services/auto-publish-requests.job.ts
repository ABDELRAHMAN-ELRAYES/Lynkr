import cron from "node-cron";
import PrismaClientSingleton from "../data-server-clients/prisma-client";

const prisma = PrismaClientSingleton.getPrismaClient();

/**
 * Auto-publish expired direct requests (opt-in only)
 * Runs every 15 minutes
 */
async function publishExpiredRequests() {
    try {
        const expiredRequests = await prisma.request.findMany({
            where: {
                status: "PENDING",
                isPublic: false,
                enableAutoPublish: true,
                targetProviderId: { not: null },
                responseDeadline: { lt: new Date() }
            },
            include: {
                client: { select: { email: true, firstName: true } },
                targetProvider: {
                    include: { user: { select: { email: true, firstName: true } } }
                }
            }
        });

        for (const request of expiredRequests) {
            await prisma.request.update({
                where: { id: request.id },
                data: { status: "PUBLIC", isPublic: true }
            });

            console.log(`[Auto-Publish] Request ${request.id} published to public`);

            // TODO: Send notifications
            // await notifyClient(request.clientId, "Your request has been published publicly.");
            // await notifyProvider(request.targetProviderId, "The request has expired and is now public.");
        }

        if (expiredRequests.length > 0) {
            console.log(`[Auto-Publish] Processed ${expiredRequests.length} expired requests`);
        }
    } catch (error) {
        console.error("[Auto-Publish] Error processing expired requests:", error);
    }
}

/**
 * Start the auto-publish cron job
 */
export function startAutoPublishJob() {
    // Run every 15 minutes
    cron.schedule("*/15 * * * *", async () => {
        console.log("[Auto-Publish] Running scheduled check...");
        await publishExpiredRequests();
    });

    console.log("✅ Auto-publish job scheduled (every 15 minutes)");
}

export { publishExpiredRequests };
