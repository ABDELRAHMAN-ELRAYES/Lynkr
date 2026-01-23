import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type SubscriptionStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface SubscriptionStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: SubscriptionStatus;
    size?: TagSize;
}

const statusConfig: Record<SubscriptionStatus, { label: string; colorScheme: ColorScheme }> = {
    PENDING: { label: "Pending", colorScheme: "warning" },
    ACTIVE: { label: "Active", colorScheme: "emerald" },
    EXPIRED: { label: "Expired", colorScheme: "neutral" },
    CANCELLED: { label: "Cancelled", colorScheme: "rose" },
};

export function SubscriptionStatusTag({ status, size, className, ...props }: SubscriptionStatusTagProps) {
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
