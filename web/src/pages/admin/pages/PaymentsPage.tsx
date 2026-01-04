"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    CreditCard,
    Download,
    Eye,
    Filter,
    MoreHorizontal,
    RefreshCcw,
    Search,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAdminContext } from "../AdminLayout";
import { getPaymentStatusColor } from "../utils/colorHelpers";

type PaymentsSubTab = "all" | "pending" | "completed" | "failed" | "refunded";

export default function PaymentsPage() {
    const { payments, setPayments, handleExportData } = useAdminContext();
    const { toast } = useToast();

    const [paymentsSubTab, setPaymentsSubTab] = useState<PaymentsSubTab>("all");
    const [paymentSearch, setPaymentSearch] = useState("");

    const handleUpdatePaymentStatus = (paymentId: string, status: string) => {
        setPayments(payments.map((p) => p.id === paymentId ? { ...p, status } : p));
        toast({ title: "Payment updated", description: `Payment ${paymentId} status updated to ${status}.` });
    };

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.id.toLowerCase().includes(paymentSearch.toLowerCase()) ||
            payment.client.toLowerCase().includes(paymentSearch.toLowerCase());
        const matchesFilter = paymentsSubTab === "all" || payment.status === paymentsSubTab;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            <section>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 to-yellow-600 p-8 text-white shadow-lg"
                >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                            <Badge className="bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/20">
                                Payment Management
                            </Badge>
                            <h2 className="text-3xl font-bold">
                                {paymentsSubTab === "pending" ? "Pending Payments" :
                                    paymentsSubTab === "completed" ? "Completed Payments" :
                                        paymentsSubTab === "failed" ? "Failed Payments" :
                                            paymentsSubTab === "refunded" ? "Refunded Payments" : "All Payments"}
                            </h2>
                            <p className="max-w-[600px] text-white/80">
                                Track payment transactions, process refunds, and manage financial records.
                            </p>
                            <Button
                                variant="outline"
                                className="rounded-2xl bg-transparent border-white/50 text-white hover:bg-white/10"
                                onClick={() => handleExportData("payments")}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export Payments
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <Select value={paymentsSubTab} onValueChange={(v) => setPaymentsSubTab(v as PaymentsSubTab)}>
                            <SelectTrigger className="w-[180px] rounded-2xl bg-white border-slate-300">
                                <SelectValue placeholder="Filter payments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Payments</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
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
                            placeholder="Search payments..."
                            value={paymentSearch}
                            onChange={(e) => setPaymentSearch(e.target.value)}
                            className="w-full rounded-2xl pl-9 bg-white border-slate-300"
                        />
                    </div>
                </div>

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
                                {filteredPayments.map((payment, index) => (
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
                </Card>
            </section>
        </div>
    );
}
