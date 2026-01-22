"use client";

import { useState } from "react";
import { useToast } from "@/shared/components/ui/use-toast";
import { Order } from "@/shared/types/order";
import { useAdminContext } from "../AdminLayout";
import { OrdersHeader } from "./components/OrdersHeader";
import { OrdersFilters, OrdersSubTab } from "./components/OrdersFilters";
import { OrdersTable } from "./components/OrdersTable";

export default function OrdersPage() {
    const { orders, setOrders, handleExportData } = useAdminContext();
    const { toast } = useToast();

    const [ordersSubTab, setOrdersSubTab] = useState<OrdersSubTab>("all");
    const [orderSearch, setOrderSearch] = useState("");

    const handleUpdateOrderStatus = (orderId: string, status: string) => {
        setOrders(orders.map((order: Order) => order.id === orderId ? { ...order, status } : order));
        toast({ title: "Order updated", description: `Order ${orderId} status updated to ${status}.` });
    };

    const filteredOrders = orders.filter((order: Order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
            order.client.toLowerCase().includes(orderSearch.toLowerCase()) ||
            order.service.toLowerCase().includes(orderSearch.toLowerCase());
        const matchesFilter = ordersSubTab === "all" || order.status === ordersSubTab;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            <OrdersHeader
                ordersSubTab={ordersSubTab}
                handleExportData={handleExportData}
            />
            <OrdersFilters
                ordersSubTab={ordersSubTab}
                setOrdersSubTab={setOrdersSubTab}
                orderSearch={orderSearch}
                setOrderSearch={setOrderSearch}
            />
            <OrdersTable
                filteredOrders={filteredOrders}
                handleUpdateOrderStatus={handleUpdateOrderStatus}
            />
        </div>
    );
}
