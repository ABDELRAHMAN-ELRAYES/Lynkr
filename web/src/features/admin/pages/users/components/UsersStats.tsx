"use client";

import {
    Activity,
    Clock,
    UserCheck,
    Users,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { UserStatistics } from "@/shared/types/user";

interface UsersStatsProps {
    statistics: UserStatistics | null;
    statsLoading: boolean;
    totalUsersCount: number;
}

export function UsersStats({ statistics, statsLoading, totalUsersCount }: UsersStatsProps) {
    return (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">
                        {statsLoading ? "..." : (statistics?.users || totalUsersCount)}
                    </div>
                    <p className="text-xs text-slate-500">
                        {statistics?.admins || 0} admins
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Active Users</CardTitle>
                    <Activity className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">
                        {statsLoading ? "..." : (statistics?.active || 0)}
                    </div>
                    <p className="text-xs text-slate-500">
                        {statistics && statistics.users > 0
                            ? Math.round((statistics.active / statistics.users) * 100)
                            : 0}% of total
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Providers</CardTitle>
                    <UserCheck className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">
                        {statsLoading ? "..." : (statistics?.providers || 0)}
                    </div>
                    <p className="text-xs text-slate-500">
                        Active service providers
                    </p>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Inactive Users</CardTitle>
                    <Clock className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">
                        {statsLoading ? "..." : (statistics?.inactive || 0)}
                    </div>
                    <p className="text-xs text-slate-500">Suspended or pending</p>
                </CardContent>
            </Card>
        </section>
    );
}
