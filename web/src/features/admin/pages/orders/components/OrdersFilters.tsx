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

export type OrdersSubTab = "all" | "pending" | "processing" | "completed" | "cancelled";

interface OrdersFiltersProps {
    ordersSubTab: OrdersSubTab;
    setOrdersSubTab: (value: OrdersSubTab) => void;
    orderSearch: string;
    setOrderSearch: (value: string) => void;
}

export function OrdersFilters({
    ordersSubTab,
    setOrdersSubTab,
    orderSearch,
    setOrderSearch,
}: OrdersFiltersProps) {
    return (
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
        </section>
    );
}
