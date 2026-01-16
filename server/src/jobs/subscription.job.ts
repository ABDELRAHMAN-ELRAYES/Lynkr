import cron from "node-cron";
import SubscriptionService from "../modules/subscription/subscription.service";

/**
 * Process expired subscriptions
 * Runs every hour
 */
async function processSubscriptions() {
    try {
        // Expire ended subscriptions
        const expiredResult = await SubscriptionService.processExpiredSubscriptions();
        if (expiredResult.processed > 0) {
            console.log(`[Subscription] Expired ${expiredResult.processed} subscriptions`);
        }

        // Send expiration warnings (3 days before)
        const warningResult = await SubscriptionService.sendExpirationWarnings();
        if (warningResult.warned > 0) {
            console.log(`[Subscription] Sent ${warningResult.warned} expiration warnings`);
        }
    } catch (error) {
        console.error("[Subscription] Error processing subscriptions:", error);
    }
}

/**
 * Start the subscription management cron job
 */
export function startSubscriptionJob() {
    // Run every hour
    cron.schedule("0 * * * *", async () => {
        console.log("[Subscription] Running scheduled check...");
        await processSubscriptions();
    });

    console.log("✅ Subscription job scheduled (every hour)");
}

export { processSubscriptions };
