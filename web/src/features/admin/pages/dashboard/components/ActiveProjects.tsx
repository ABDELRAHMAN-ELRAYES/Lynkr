"use client";

import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { ProjectStatusTag, StatusTag } from "@/shared/components/common/tags";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/utils";
import { activeProjects } from "@/features/admin/data/mockData";

export function ActiveProjects() {
    return (
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
                <StatusTag colorScheme="neutral">
                    {activeProjects.length} Active
                </StatusTag>
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
                                    <StatusTag
                                        colorScheme={
                                            project.priority.toLowerCase() === 'high' ? 'error' :
                                                project.priority.toLowerCase() === 'medium' ? 'warning' : 'success'
                                        }
                                    >
                                        {project.priority}
                                    </StatusTag>
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
    );
}
