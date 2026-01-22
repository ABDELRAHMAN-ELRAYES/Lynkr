"use client";

import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { recentActivities } from "@/features/admin/data/mockData";

export function RecentActivity() {
    return (
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
    );
}
