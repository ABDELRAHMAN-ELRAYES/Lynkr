"use client";

import {
    CheckCircle,
    Clock,
    Layers,
    Timer,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card"; 

interface ProjectsStatsProps {
    activeCount: number;
}

export function ProjectsStats({ activeCount }: ProjectsStatsProps) {
    return (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Active Projects</CardTitle>
                    <Layers className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">{activeCount}</div>
                    <p className="text-xs text-slate-500">Currently in progress</p>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">12</div>
                    <p className="text-xs text-slate-500">This month</p>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Pending Review</CardTitle>
                    <Clock className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">5</div>
                    <p className="text-xs text-slate-500">Awaiting approval</p>
                </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">On Time Rate</CardTitle>
                    <Timer className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-800">98%</div>
                    <p className="text-xs text-slate-500">Delivery performance</p>
                </CardContent>
            </Card>
        </section>
    );
}
