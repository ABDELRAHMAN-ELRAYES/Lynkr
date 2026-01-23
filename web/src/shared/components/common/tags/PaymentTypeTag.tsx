import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type PaymentType = "FULL" | "INITIAL" | "FINAL" | "SESSION";

export interface PaymentTypeTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    type: PaymentType;
    size?: TagSize;
}

const typeConfig: Record<PaymentType, { label: string; colorScheme: ColorScheme }> = {
    FULL: { label: "Full", colorScheme: "teal" },
    INITIAL: { label: "Initial", colorScheme: "blue" },
    FINAL: { label: "Final", colorScheme: "emerald" },
    SESSION: { label: "Session", colorScheme: "violet" },
};

export function PaymentTypeTag({ type, size, className, ...props }: PaymentTypeTagProps) {
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
