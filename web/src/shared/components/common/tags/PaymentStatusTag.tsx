import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type PaymentStatus = "PENDING" | "COMPLETED" | "REFUNDED" | "CANCELLED";

export interface PaymentStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: PaymentStatus;
    size?: TagSize;
}

const statusConfig: Record<PaymentStatus, { label: string; colorScheme: ColorScheme }> = {
    PENDING: { label: "Pending", colorScheme: "warning" },
    COMPLETED: { label: "Completed", colorScheme: "success" },
    REFUNDED: { label: "Refunded", colorScheme: "orange" },
    CANCELLED: { label: "Cancelled", colorScheme: "error" },
};

export function PaymentStatusTag({ status, size, className, ...props }: PaymentStatusTagProps) {
    const config = statusConfig[status] || { label: status, colorScheme: "neutral" as ColorScheme };

    return (
        <StatusTag
            colorScheme={config.colorScheme}
            size={size}
            className={cn(className)}
            {...props}
        >
            {config.label}
        </StatusTag>
    );
}
