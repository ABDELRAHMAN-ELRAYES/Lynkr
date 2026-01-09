"use client";

import { motion } from "framer-motion";
import {
    Activity,
    Clock,
    DollarSign,
    Layers,
    TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";
import {
    platformStats,
    recentActivities,
    activeProjects,
    financialOverview,
} from "./mockData";
import { getPriorityColor } from "./utils.tsx";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <section>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-8 text-white shadow-lg"
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

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg text-slate-800">
                                Recent Activity
                            </CardTitle>
                            <CardDescription className="text-slate-500">
                                Latest actions and updates on the platform
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="rounded-xl border-slate-300">
                            Live
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.slice(0, 5).map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/70"
                                >
                                    <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-slate-200">
                                        <AvatarImage src={activity.avatar} alt={activity.user} />
                                        <AvatarFallback>{activity.user[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">
                                            {activity.user}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {activity.action}
                                        </p>
                                    </div>
                                    <div className="text-xs text-slate-400 flex-shrink-0">
                                        {activity.time}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg text-slate-800">
                                Active Projects
                            </CardTitle>
                            <CardDescription className="text-slate-500">
                                Projects currently in progress
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="rounded-xl border-slate-300">
                            {activeProjects.length} Active
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activeProjects.slice(0, 4).map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/70"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-slate-800 truncate">
                                                {project.name}
                                            </p>
                                            <Badge
                                                className={cn(
                                                    "rounded-xl font-medium",
                                                    getPriorityColor(project.priority)
                                                )}
                                            >
                                                {project.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {project.client}
                                        </p>
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-slate-500">Progress</span>
                                                <span className="font-medium text-slate-700">
                                                    {project.progress}%
                                                </span>
                                            </div>
                                            <Progress
                                                value={project.progress}
                                                className="h-2 bg-slate-200"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section>
                <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800">
                            Financial Overview
                        </CardTitle>
                        <CardDescription className="text-slate-500">
                            Revenue and transaction metrics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-100">
                                        <DollarSign className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Total Revenue</p>
                                        <p className="text-lg font-bold text-slate-800">
                                            {financialOverview.totalRevenue}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-100">
                                        <Activity className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Monthly Revenue</p>
                                        <p className="text-lg font-bold text-slate-800">
                                            {financialOverview.monthlyRevenue}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-violet-100">
                                        <Layers className="h-5 w-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Transactions</p>
                                        <p className="text-lg font-bold text-slate-800">
                                            {financialOverview.transactions}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-amber-100">
                                        <Clock className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Pending Payouts</p>
                                        <p className="text-lg font-bold text-slate-800">
                                            {financialOverview.pendingPayouts}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
