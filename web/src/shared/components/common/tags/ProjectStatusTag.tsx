import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type ProjectStatus =
    | "PENDING_PAYMENT"
    | "IN_PROGRESS"
    | "AWAITING_REVIEW"
    | "AWAITING_CLIENT_REVIEW"
    | "COMPLETED"
    | "CONFIRMED"
    | "CANCELLED"
    | "DISPUTED";

export interface ProjectStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: ProjectStatus;
    size?: TagSize;
}

const statusConfig: Record<ProjectStatus, { label: string; colorScheme: ColorScheme }> = {
    PENDING_PAYMENT: { label: "Pending Payment", colorScheme: "orange" },
    IN_PROGRESS: { label: "In Progress", colorScheme: "sky" },
    AWAITING_REVIEW: { label: "Awaiting Review", colorScheme: "warning" },
    AWAITING_CLIENT_REVIEW: { label: "Awaiting Review", colorScheme: "warning" },
    COMPLETED: { label: "Completed", colorScheme: "emerald" },
    CONFIRMED: { label: "Confirmed", colorScheme: "teal" },
    CANCELLED: { label: "Cancelled", colorScheme: "rose" },
    DISPUTED: { label: "Disputed", colorScheme: "pink" },
};

export function ProjectStatusTag({ status, size, className, ...props }: ProjectStatusTagProps) {
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
