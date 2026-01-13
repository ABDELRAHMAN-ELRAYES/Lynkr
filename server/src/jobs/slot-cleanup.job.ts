import SlotService from "../modules/teaching/slot/slot.service";

/**
 * Slot Cleanup Job
 * Deletes past unreserved teaching slots daily at 2 AM
 */
class SlotCleanupJob {
    private intervalId: NodeJS.Timeout | null = null;

    start() {
        // Run immediately on start
        this.runCleanup();

        // Schedule to run every 24 hours
        this.intervalId = setInterval(() => {
            this.runCleanup();
        }, 24 * 60 * 60 * 1000); // 24 hours

        console.log("✅ Slot cleanup job started");
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log("⏹️ Slot cleanup job stopped");
        }
    }

    private async runCleanup() {
        try {
            const result = await SlotService.cleanupExpiredSlots();
            console.log(`[Cleanup] Deleted ${result.count} expired slots`);
        } catch (error) {
            console.error("[Cleanup] Failed to clean expired slots:", error);
        }
    }
}

export const slotCleanupJob = new SlotCleanupJob();
