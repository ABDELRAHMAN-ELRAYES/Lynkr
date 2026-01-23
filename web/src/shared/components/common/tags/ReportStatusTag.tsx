import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type ReportStatus = "SUBMITTED" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";

export interface ReportStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: ReportStatus;
    size?: TagSize;
}

const statusConfig: Record<ReportStatus, { label: string; colorScheme: ColorScheme }> = {
    SUBMITTED: { label: "Submitted", colorScheme: "info" },
    UNDER_REVIEW: { label: "Under Review", colorScheme: "warning" },
    RESOLVED: { label: "Resolved", colorScheme: "success" },
    DISMISSED: { label: "Dismissed", colorScheme: "neutral" },
};

export function ReportStatusTag({ status, size, className, ...props }: ReportStatusTagProps) {
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
