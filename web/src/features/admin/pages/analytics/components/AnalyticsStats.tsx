"use client";

import {
    Activity,
    DollarSign,
    Layers,
    TrendingUp,
    Users,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { analyticsData } from "@/features/admin/data/mockData";

export function AnalyticsStats() {
    return (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">{analyticsData.users.total.toLocaleString()}</div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">+{analyticsData.users.growth}%</span> from last month
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">${analyticsData.revenue.total.toLocaleString()}</div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">+{analyticsData.revenue.growth}%</span> from last month
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Active Projects</CardTitle>
                    <Layers className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">{analyticsData.projects.active.toLocaleString()}</div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">+{analyticsData.projects.growth}%</span> from last month
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Engagement Rate</CardTitle>
                    <Activity className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">{analyticsData.engagement.rate}%</div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">+{analyticsData.engagement.growth}%</span> from last month
                    </p>
                </CardContent>
            </Card>
        </section>
    );
}
