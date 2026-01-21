"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Download,
    Edit,
    Eye,
    Filter,
    MoreHorizontal,
    Search,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import Button from "@/shared/components/ui/Button";
import {
    Card,
    CardContent,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { useToast } from "@/shared/components/ui/use-toast";
import { useAdminContext } from "./AdminLayout";
import { getPriorityColor } from "./utils.tsx";

type OrdersSubTab = "all" | "pending" | "processing" | "completed" | "cancelled";

export default function OrdersPage() {
    const { orders, setOrders, handleExportData } = useAdminContext();
    const { toast } = useToast();

    const [ordersSubTab, setOrdersSubTab] = useState<OrdersSubTab>("all");
    const [orderSearch, setOrderSearch] = useState("");

    const handleUpdateOrderStatus = (orderId: string, status: string) => {
        setOrders(orders.map((order) => order.id === orderId ? { ...order, status } : order));
        toast({ title: "Order updated", description: `Order ${orderId} status updated to ${status}.` });
    };

    const getOrderStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
            case "processing": return "bg-blue-50 text-blue-700 border-blue-200";
            case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "cancelled": return "bg-rose-50 text-rose-700 border-rose-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
            order.client.toLowerCase().includes(orderSearch.toLowerCase()) ||
            order.service.toLowerCase().includes(orderSearch.toLowerCase());
        const matchesFilter = ordersSubTab === "all" || order.status === ordersSubTab;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            <section>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 p-8 text-white shadow-lg"
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

            <section className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <Select value={ordersSubTab} onValueChange={(v) => setOrdersSubTab(v as OrdersSubTab)}>
                            <SelectTrigger className="w-[180px] rounded-2xl bg-white border-slate-300">
                                <SelectValue placeholder="Filter orders" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Orders</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" className="rounded-2xl bg-white border-slate-300 text-slate-700 hover:bg-slate-100">
                            <Filter className="mr-2 h-4 w-4" />
                            More Filters
                        </Button>
                    </div>

                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search orders..."
                            value={orderSearch}
                            onChange={(e) => setOrderSearch(e.target.value)}
                            className="w-full rounded-2xl pl-9 bg-white border-slate-300"
                        />
                    </div>
                </div>

                <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-slate-200">
                                    <TableHead className="p-4 text-slate-600">Order ID</TableHead>
                                    <TableHead className="p-4 text-slate-600">Client</TableHead>
                                    <TableHead className="p-4 text-slate-600">Service</TableHead>
                                    <TableHead className="p-4 text-slate-600">Amount</TableHead>
                                    <TableHead className="p-4 text-slate-600">Status</TableHead>
                                    <TableHead className="p-4 text-slate-600">Date</TableHead>
                                    <TableHead className="p-4 text-slate-600">Priority</TableHead>
                                    <TableHead className="p-4 text-right text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order, index) => (
                                    <TableRow key={order.id} className={cn("border-b-slate-200/80", index % 2 !== 0 && "bg-slate-50/50")}>
                                        <TableCell className="p-4">
                                            <div className="font-semibold text-slate-800">{order.id}</div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{order.client[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-slate-700">{order.client}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4 text-sm text-slate-700">{order.service}</TableCell>
                                        <TableCell className="p-4">
                                            <div className="text-sm font-medium text-slate-800">${order.amount.toLocaleString()}</div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <Badge variant="outline" className={cn("rounded-xl font-medium", getOrderStatusColor(order.status))}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-1 text-sm text-slate-600">
                                                <Calendar className="h-4 w-4" />
                                                {order.date}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <Badge className={cn("rounded-xl font-medium", getPriorityColor(order.priority))}>
                                                {order.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="rounded-xl h-9 w-9 data-[state=open]:bg-slate-100">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                                                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Order</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "processing")}>Mark Processing</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "completed")}>Mark Completed</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-rose-600" onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}>Cancel Order</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
