"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import Button from "@/shared/components/ui/Button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { useAdminContext } from "../AdminLayout";
import { AnalyticsStats } from "./components/AnalyticsStats";
import { UserGrowthCard } from "./components/UserGrowthCard";
import { RevenueAnalyticsCard } from "./components/RevenueAnalyticsCard";

export default function AnalyticsPage() {
    const { handleExportData } = useAdminContext();
    const [analyticsTimeRange, setAnalyticsTimeRange] = useState("30d");

    return (
        <div className="space-y-8">
            <section>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden rounded-3xl bg-[#7682e8] p-8 text-white shadow-lg"
                >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                            <Badge className="bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/20">
                                Analytics & Reports
                            </Badge>
                            <h2 className="text-3xl font-bold">Platform Analytics</h2>
                            <p className="max-w-[600px] text-white/80">
                                Comprehensive analytics and insights into platform performance,
                                user behavior, revenue trends, and business metrics.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Select value={analyticsTimeRange} onValueChange={setAnalyticsTimeRange}>
                                    <SelectTrigger className="w-[140px] rounded-2xl bg-white/10 border-white/20 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7d">Last 7 days</SelectItem>
                                        <SelectItem value="30d">Last 30 days</SelectItem>
                                        <SelectItem value="90d">Last 90 days</SelectItem>
                                        <SelectItem value="1y">Last year</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    className="rounded-2xl bg-transparent border-white/50 text-white hover:bg-white/10"
                                    onClick={() => handleExportData("analytics")}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Report
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <AnalyticsStats />

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserGrowthCard />
                <RevenueAnalyticsCard />
            </section>
        </div>
    );
}
