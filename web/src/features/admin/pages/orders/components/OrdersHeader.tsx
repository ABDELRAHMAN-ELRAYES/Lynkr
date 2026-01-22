"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import Button from "@/shared/components/ui/Button";

interface OrdersHeaderProps {
    ordersSubTab: string;
    handleExportData: (type: string) => void;
}

export function OrdersHeader({ ordersSubTab, handleExportData }: OrdersHeaderProps) {
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
                            Order Management
                        </Badge>
                        <h2 className="text-3xl font-bold">
                            {ordersSubTab === "pending" ? "Pending Orders" :
                                ordersSubTab === "processing" ? "Processing Orders" :
                                    ordersSubTab === "completed" ? "Completed Orders" :
                                        ordersSubTab === "cancelled" ? "Cancelled Orders" : "All Orders"}
                        </h2>
                        <p className="max-w-[600px] text-white/80">
                            Track and manage all orders, update statuses, and resolve issues.
                        </p>
                        <Button
                            variant="outline"
                            className="rounded-2xl bg-transparent border-white/50 text-white hover:bg-white/10"
                            onClick={() => handleExportData("orders")}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export Orders
                        </Button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
