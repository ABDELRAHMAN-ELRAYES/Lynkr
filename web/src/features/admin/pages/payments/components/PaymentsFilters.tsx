"use client";

import { Filter, Search } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

export type PaymentsSubTab = "all" | "pending" | "completed" | "failed" | "refunded";

interface PaymentsFiltersProps {
    paymentsSubTab: PaymentsSubTab;
    setPaymentsSubTab: (value: PaymentsSubTab) => void;
    paymentSearch: string;
    setPaymentSearch: (value: string) => void;
}

export function PaymentsFilters({
    paymentsSubTab,
    setPaymentsSubTab,
    paymentSearch,
    setPaymentSearch,
}: PaymentsFiltersProps) {
    return (
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
        </section>
    );
}
