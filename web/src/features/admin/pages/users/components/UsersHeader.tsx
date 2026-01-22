"use client";

import { motion } from "framer-motion";
import { Download, UserPlus } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import Button from "@/shared/components/ui/Button";

interface UsersHeaderProps {
    usersSubTab: string;
    handleExportData: (type: string) => void;
    setIsCreatingUser: (value: boolean) => void;
}

export function UsersHeader({ usersSubTab, handleExportData, setIsCreatingUser }: UsersHeaderProps) {
    return (
        <section>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-3xl bg-[#7682e8] p-8 text-white shadow-lg"
            >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-4">
                        <Badge className="bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/20">
                            User Management
                        </Badge>
                        <h2 className="text-3xl font-bold">
                            {usersSubTab === "active" ? "Active Users" :
                                usersSubTab === "pending" ? "Pending Approval" :
                                    usersSubTab === "suspended" ? "Suspended Users" :
                                        usersSubTab === "provider-requests" ? "Provider Requests" : "All Users"}
                        </h2>
                        <p className="max-w-[600px] text-white/80">
                            Manage all users, their roles, status, and activities across the platform.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                className="rounded-2xl bg-white text-emerald-700 hover:bg-white/90 shadow"
                                onClick={() => setIsCreatingUser(true)}
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-2xl bg-transparent border-white/50 text-white hover:bg-white/10"
                                onClick={() => handleExportData("users")}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export Users
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
