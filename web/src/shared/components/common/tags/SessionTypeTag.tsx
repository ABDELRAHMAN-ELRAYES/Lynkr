import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type SessionType = "ONE_TO_ONE" | "GROUP";

export interface SessionTypeTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    type: SessionType;
    size?: TagSize;
}

const typeConfig: Record<SessionType, { label: string; colorScheme: ColorScheme }> = {
    ONE_TO_ONE: { label: "1:1 Session", colorScheme: "blue" },
    GROUP: { label: "Group Session", colorScheme: "violet" },
};

export function SessionTypeTag({ type, size, className, ...props }: SessionTypeTagProps) {
    const config = typeConfig[type] || { label: type, colorScheme: "neutral" as ColorScheme };

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
