"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/shared/components/ui/card";
import { analyticsData } from "@/features/admin/data/mockData";

export function RevenueAnalyticsCard() {
    return (
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
    );
}
