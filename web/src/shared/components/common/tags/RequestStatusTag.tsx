import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type RequestStatus = "PENDING" | "PUBLIC" | "ACCEPTED" | "EXPIRED" | "CANCELLED";

export interface RequestStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: RequestStatus;
    size?: TagSize;
}

const statusConfig: Record<RequestStatus, { label: string; colorScheme: ColorScheme }> = {
    PENDING: { label: "Pending", colorScheme: "warning" },
    PUBLIC: { label: "Public", colorScheme: "sky" },
    ACCEPTED: { label: "Accepted", colorScheme: "emerald" },
    EXPIRED: { label: "Expired", colorScheme: "neutral" },
    CANCELLED: { label: "Cancelled", colorScheme: "rose" },
};

export function RequestStatusTag({ status, size, className, ...props }: RequestStatusTagProps) {
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
