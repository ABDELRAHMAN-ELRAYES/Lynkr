import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type ProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface ProposalStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: ProposalStatus;
    size?: TagSize;
}

const statusConfig: Record<ProposalStatus, { label: string; colorScheme: ColorScheme }> = {
    PENDING: { label: "Pending", colorScheme: "warning" },
    ACCEPTED: { label: "Accepted", colorScheme: "success" },
    REJECTED: { label: "Rejected", colorScheme: "error" },
};

export function ProposalStatusTag({ status, size, className, ...props }: ProposalStatusTagProps) {
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
