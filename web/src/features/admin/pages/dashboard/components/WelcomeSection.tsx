"use client";

import { motion } from "framer-motion";
import { Badge } from "@/shared/components/ui/badge";

export function WelcomeSection() {
    return (
        <section>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-3xl bg-7682e8 p-8 text-white shadow-lg"
            >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-4">
                        <Badge className="bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/20">
                            Platform Overview
                        </Badge>
                        <h2 className="text-3xl font-bold">Welcome back, Admin!</h2>
                        <p className="max-w-[600px] text-white/80">
                            Here&apos;s what&apos;s happening with your platform today. You
                            have new users to review, active projects, and pending orders
                            requiring attention.
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
