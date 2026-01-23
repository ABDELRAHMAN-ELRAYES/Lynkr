import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type EscrowStatus = "HOLDING" | "RELEASED" | "REFUNDED";

export interface EscrowStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: EscrowStatus;
    size?: TagSize;
}

const statusConfig: Record<EscrowStatus, { label: string; colorScheme: ColorScheme }> = {
    HOLDING: { label: "Holding", colorScheme: "warning" },
    RELEASED: { label: "Released", colorScheme: "emerald" },
    REFUNDED: { label: "Refunded", colorScheme: "rose" },
};

export function EscrowStatusTag({ status, size, className, ...props }: EscrowStatusTagProps) {
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
