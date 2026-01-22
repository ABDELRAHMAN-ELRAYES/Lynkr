"use client";

import {
    Calendar,
    Edit,
    Eye,
    MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import Button from "@/shared/components/ui/Button";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/shared/components/ui/card";
import { Pagination } from "@/shared/components/common/pagination";
import { useState } from "react";
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
import { Order } from "@/shared/types/order";
import { getPriorityColor } from "@/features/admin/utils/adminUtils";

interface OrdersTableProps {
    filteredOrders: Order[];
    handleUpdateOrderStatus: (id: string, status: string) => void;
}

export function OrdersTable({
    filteredOrders,
    handleUpdateOrderStatus
}: OrdersTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getOrderStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-amber-50 text-amber-700 border-amber-200";
            case "processing": return "bg-blue-50 text-blue-700 border-blue-200";
            case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "cancelled": return "bg-rose-50 text-rose-700 border-rose-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
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
                        {paginatedOrders.map((order, index) => (
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
            {totalPages > 1 && (
                <CardFooter className="flex items-center justify-between p-4 border-t border-slate-200/80">
                    <div className="text-sm text-slate-500">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </CardFooter>
            )}
        </Card>
    );
}
