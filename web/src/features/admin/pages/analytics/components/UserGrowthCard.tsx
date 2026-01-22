"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/shared/components/ui/card";
import { analyticsData } from "@/features/admin/data/mockData";

export function UserGrowthCard() {
    return (
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
    );
}
