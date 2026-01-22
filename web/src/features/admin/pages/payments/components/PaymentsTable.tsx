"use client";

import {
    Calendar,
    CreditCard,
    Download,
    Eye,
    MoreHorizontal,
    RefreshCcw,
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
import { Payment } from "@/shared/types/payment";
import { getPaymentStatusColor } from "@/features/admin/utils/adminUtils";

interface PaymentsTableProps {
    filteredPayments: Payment[];
    handleUpdatePaymentStatus: (id: string, status: string) => void;
}

export function PaymentsTable({
    filteredPayments,
    handleUpdatePaymentStatus
}: PaymentsTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const paginatedPayments = filteredPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-slate-200">
                            <TableHead className="p-4 text-slate-600">Payment ID</TableHead>
                            <TableHead className="p-4 text-slate-600">Client</TableHead>
                            <TableHead className="p-4 text-slate-600">Amount</TableHead>
                            <TableHead className="p-4 text-slate-600">Method</TableHead>
                            <TableHead className="p-4 text-slate-600">Status</TableHead>
                            <TableHead className="p-4 text-slate-600">Date</TableHead>
                            <TableHead className="p-4 text-right text-slate-600">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedPayments.map((payment, index) => (
                            <TableRow key={payment.id} className={cn("border-b-slate-200/80", index % 2 !== 0 && "bg-slate-50/50")}>
                                <TableCell className="p-4">
                                    <div className="font-semibold text-slate-800">{payment.id}</div>
                                </TableCell>
                                <TableCell className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{payment.client[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-slate-700">{payment.client}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="p-4">
                                    <div className="text-sm font-medium text-slate-800">${payment.amount.toLocaleString()}</div>
                                </TableCell>
                                <TableCell className="p-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <CreditCard className="h-4 w-4" />
                                        {payment.method}
                                    </div>
                                </TableCell>
                                <TableCell className="p-4">
                                    <Badge variant="outline" className={cn("rounded-xl font-medium", getPaymentStatusColor(payment.status))}>
                                        {payment.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="p-4">
                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                        <Calendar className="h-4 w-4" />
                                        {payment.date}
                                    </div>
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
                                            <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Download Receipt</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {payment.status === "pending" && (
                                                <DropdownMenuItem onClick={() => handleUpdatePaymentStatus(payment.id, "completed")}>
                                                    <CreditCard className="mr-2 h-4 w-4" /> Process Payment
                                                </DropdownMenuItem>
                                            )}
                                            {payment.status === "completed" && (
                                                <DropdownMenuItem className="text-rose-600" onClick={() => handleUpdatePaymentStatus(payment.id, "refunded")}>
                                                    <RefreshCcw className="mr-2 h-4 w-4" /> Refund Payment
                                                </DropdownMenuItem>
                                            )}
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
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} entries
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
