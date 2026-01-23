import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type ProjectStatus =
    | "PENDING_PAYMENT"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CONFIRMED"
    | "CANCELLED"
    | "DISPUTED";

export interface ProjectStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: ProjectStatus;
    size?: TagSize;
}

const statusConfig: Record<ProjectStatus, { label: string; colorScheme: ColorScheme }> = {
    PENDING_PAYMENT: { label: "Pending Payment", colorScheme: "warning" },
    IN_PROGRESS: { label: "In Progress", colorScheme: "info" },
    COMPLETED: { label: "Completed", colorScheme: "success" },
    CONFIRMED: { label: "Confirmed", colorScheme: "emerald" },
    CANCELLED: { label: "Cancelled", colorScheme: "error" },
    DISPUTED: { label: "Disputed", colorScheme: "orange" },
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
