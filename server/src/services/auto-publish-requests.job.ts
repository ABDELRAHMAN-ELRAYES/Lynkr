import cron from "node-cron";
import PrismaClientSingleton from "../data-server-clients/prisma-client";
import NotificationService from "../modules/notification/notification.service";

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
                    include: { user: { select: { id: true, email: true, firstName: true } } }
                }
            }
        });

        for (const request of expiredRequests) {
            await prisma.request.update({
                where: { id: request.id },
                data: { status: "PUBLIC", isPublic: true }
            });

            console.log(`[Auto-Publish] Request ${request.id} published to public`);

            // Notify client that request is now public
            await NotificationService.sendSystemNotification(
                request.clientId,
                "Request Published Publicly",
                `Your request "${request.title}" has been auto-published as the provider response deadline passed.`
            );

            // Notify original provider that request expired
            if (request.targetProvider?.user?.id) {
                await NotificationService.sendSystemNotification(
                    request.targetProvider.user.id,
                    "Request Deadline Expired",
                    `The request "${request.title}" has expired and is now open to other providers.`
                );
            }
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
