import * as React from "react";
import { StatusTag, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export interface ActiveStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    active: boolean;
    activeLabel?: string;
    inactiveLabel?: string;
    size?: TagSize;
}

export function ActiveStatusTag({
    active,
    activeLabel = "Active",
    inactiveLabel = "Inactive",
    size,
    className,
    ...props
}: ActiveStatusTagProps) {
    return (
        <StatusTag
            colorScheme={active ? "success" : "neutral"}
            size={size}
            className={cn(className)}
            {...props}
        >
            {active ? activeLabel : inactiveLabel}
        </StatusTag>
    );
}
