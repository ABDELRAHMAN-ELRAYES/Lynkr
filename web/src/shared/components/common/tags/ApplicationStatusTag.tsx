import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApplicationStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: ApplicationStatus;
    size?: TagSize;
}

const statusConfig: Record<ApplicationStatus, { label: string; colorScheme: ColorScheme }> = {
    PENDING: { label: "Pending", colorScheme: "warning" },
    APPROVED: { label: "Approved", colorScheme: "emerald" },
    REJECTED: { label: "Rejected", colorScheme: "rose" },
};

export function ApplicationStatusTag({ status, size, className, ...props }: ApplicationStatusTagProps) {
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
