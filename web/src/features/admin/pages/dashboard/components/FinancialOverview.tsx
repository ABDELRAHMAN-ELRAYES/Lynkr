"use client";

import {
    Activity,
    Clock,
    DollarSign,
    Layers,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { financialOverview } from "@/features/admin/data/mockData";

export function FinancialOverview() {
    return (
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
    );
}
