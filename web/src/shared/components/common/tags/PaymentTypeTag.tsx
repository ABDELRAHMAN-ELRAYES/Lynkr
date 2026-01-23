import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type PaymentType = "FULL" | "INITIAL" | "FINAL" | "SESSION";

export interface PaymentTypeTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    type: PaymentType;
    size?: TagSize;
}

const typeConfig: Record<PaymentType, { label: string; colorScheme: ColorScheme }> = {
    FULL: { label: "Full", colorScheme: "success" },
    INITIAL: { label: "Initial", colorScheme: "info" },
    FINAL: { label: "Final", colorScheme: "emerald" },
    SESSION: { label: "Session", colorScheme: "purple" },
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
