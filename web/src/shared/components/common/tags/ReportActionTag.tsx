import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type ReportAction = "STATUS_CHANGE" | "WARNING" | "SUSPEND" | "BAN";

export interface ReportActionTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    action: ReportAction;
    size?: TagSize;
}

const actionConfig: Record<ReportAction, { label: string; colorScheme: ColorScheme }> = {
    STATUS_CHANGE: { label: "Status Change", colorScheme: "blue" },
    WARNING: { label: "Warning", colorScheme: "warning" },
    SUSPEND: { label: "Suspend", colorScheme: "orange" },
    BAN: { label: "Ban", colorScheme: "rose" },
};

export function ReportActionTag({ action, size, className, ...props }: ReportActionTagProps) {
    const config = actionConfig[action] || { label: action, colorScheme: "neutral" as ColorScheme };

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
