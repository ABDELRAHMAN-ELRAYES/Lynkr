"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { platformStats } from "@/features/admin/data/mockData";

export function StatsGrid() {
    return (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {platformStats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">
                                {stat.title}
                            </CardTitle>
                            <div className={cn("p-2 rounded-2xl", stat.bgColor)}>
                                {stat.icon}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-800">
                                {stat.value}
                            </div>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                <TrendingUp className="h-3 w-3 text-emerald-600" />
                                <span className="text-emerald-600">{stat.change}</span>
                                from last month
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </section>
    );
}
