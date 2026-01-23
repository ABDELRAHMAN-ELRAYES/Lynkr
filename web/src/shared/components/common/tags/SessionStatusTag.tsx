import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type SessionStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface SessionStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: SessionStatus;
    size?: TagSize;
}

const statusConfig: Record<SessionStatus, { label: string; colorScheme: ColorScheme }> = {
    SCHEDULED: { label: "Scheduled", colorScheme: "blue" },
    IN_PROGRESS: { label: "In Progress", colorScheme: "warning" },
    COMPLETED: { label: "Completed", colorScheme: "emerald" },
    CANCELLED: { label: "Cancelled", colorScheme: "rose" },
    NO_SHOW: { label: "No Show", colorScheme: "pink" },
};

export function SessionStatusTag({ status, size, className, ...props }: SessionStatusTagProps) {
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
