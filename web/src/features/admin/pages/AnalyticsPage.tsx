"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    DollarSign,
    Download,
    Layers,
    TrendingUp,
    Users,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import Button from "@/shared/components/ui/Button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/shared/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { useAdminContext } from "./AdminLayout";
import { analyticsData } from "./mockData";

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
                    className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 to-red-600 p-8 text-white shadow-lg"
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

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                        <CardDescription>User registration and activity trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/70">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">New Users</p>
                                    <p className="text-xs text-slate-500">This month</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-slate-800">{analyticsData.users.new}</p>
                                    <p className="text-xs text-emerald-600">+12.5%</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/70">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Active Users</p>
                                    <p className="text-xs text-slate-500">Daily average</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-slate-800">{analyticsData.users.active.toLocaleString()}</p>
                                    <p className="text-xs text-emerald-600">+8.3%</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/70">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Session Duration</p>
                                    <p className="text-xs text-slate-500">Average</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-slate-800">{analyticsData.engagement.duration}</p>
                                    <p className="text-xs text-emerald-600">+4.2%</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle>Revenue Analytics</CardTitle>
                        <CardDescription>Financial performance and projections</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/70">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Average Order</p>
                                    <p className="text-xs text-slate-500">Per transaction</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-slate-800">${analyticsData.revenue.average}</p>
                                    <p className="text-xs text-emerald-600">+6.8%</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/70">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Projected Revenue</p>
                                    <p className="text-xs text-slate-500">Next month</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-slate-800">${analyticsData.revenue.projected.toLocaleString()}</p>
                                    <p className="text-xs text-emerald-600">+9.7%</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/70">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Completed Projects</p>
                                    <p className="text-xs text-slate-500">This month</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-slate-800">{analyticsData.projects.completed}</p>
                                    <p className="text-xs text-emerald-600">+11.2%</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
