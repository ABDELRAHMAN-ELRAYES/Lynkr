import * as React from "react";
import { StatusTag, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export interface UserStatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    active: boolean;
    size?: TagSize;
}

export function UserStatusTag({ active, size, className, ...props }: UserStatusTagProps) {
    return (
        <StatusTag
            colorScheme={active ? "success" : "neutral"}
            size={size}
            className={cn(className)}
            {...props}
        >
            {active ? "Active" : "Inactive"}
        </StatusTag>
    );
}
