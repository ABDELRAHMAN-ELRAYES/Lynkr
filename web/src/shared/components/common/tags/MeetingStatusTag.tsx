import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type MeetingStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface MeetingStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: MeetingStatus;
    size?: TagSize;
}

const statusConfig: Record<MeetingStatus, { label: string; colorScheme: ColorScheme }> = {
    PENDING: { label: "Pending", colorScheme: "warning" },
    ACTIVE: { label: "Active", colorScheme: "success" },
    COMPLETED: { label: "Completed", colorScheme: "info" },
    CANCELLED: { label: "Cancelled", colorScheme: "error" },
};

export function MeetingStatusTag({ status, size, className, ...props }: MeetingStatusTagProps) {
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
