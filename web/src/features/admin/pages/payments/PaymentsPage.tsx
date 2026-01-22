"use client";

import { useState } from "react";
import { useToast } from "@/shared/components/ui/use-toast";
import { Payment } from "@/shared/types/payment";
import { useAdminContext } from "../AdminLayout";
import { PaymentsHeader } from "./components/PaymentsHeader";
import { PaymentsFilters, PaymentsSubTab } from "./components/PaymentsFilters";
import { PaymentsTable } from "./components/PaymentsTable";

export default function PaymentsPage() {
    const { payments, setPayments, handleExportData } = useAdminContext();
    const { toast } = useToast();

    const [paymentsSubTab, setPaymentsSubTab] = useState<PaymentsSubTab>("all");
    const [paymentSearch, setPaymentSearch] = useState("");

    const handleUpdatePaymentStatus = (paymentId: string, status: string) => {
        setPayments(payments.map((p: Payment) => p.id === paymentId ? { ...p, status } : p));
        toast({ title: "Payment updated", description: `Payment ${paymentId} status updated to ${status}.` });
    };

    const filteredPayments = payments.filter((payment: Payment) => {
        const matchesSearch =
            payment.id.toLowerCase().includes(paymentSearch.toLowerCase()) ||
            payment.client.toLowerCase().includes(paymentSearch.toLowerCase());
        const matchesFilter = paymentsSubTab === "all" || payment.status === paymentsSubTab;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            <PaymentsHeader
                paymentsSubTab={paymentsSubTab}
                handleExportData={handleExportData}
            />
            <PaymentsFilters
                paymentsSubTab={paymentsSubTab}
                setPaymentsSubTab={setPaymentsSubTab}
                paymentSearch={paymentSearch}
                setPaymentSearch={setPaymentSearch}
            />
            <PaymentsTable
                filteredPayments={filteredPayments}
                handleUpdatePaymentStatus={handleUpdatePaymentStatus}
            />
        </div>
    );
}
