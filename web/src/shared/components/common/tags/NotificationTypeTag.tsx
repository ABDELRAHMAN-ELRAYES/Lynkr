import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type NotificationType =
    | "MESSAGE"
    | "PROPOSAL"
    | "PROJECT"
    | "PAYMENT"
    | "REVIEW"
    | "SESSION"
    | "SYSTEM";

export interface NotificationTypeTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    type: NotificationType;
    size?: TagSize;
}

const typeConfig: Record<NotificationType, { label: string; colorScheme: ColorScheme }> = {
    MESSAGE: { label: "Message", colorScheme: "blue" },
    PROPOSAL: { label: "Proposal", colorScheme: "violet" },
    PROJECT: { label: "Project", colorScheme: "teal" },
    PAYMENT: { label: "Payment", colorScheme: "emerald" },
    REVIEW: { label: "Review", colorScheme: "orange" },
    SESSION: { label: "Session", colorScheme: "sky" },
    SYSTEM: { label: "System", colorScheme: "neutral" },
};

export function NotificationTypeTag({ type, size, className, ...props }: NotificationTypeTagProps) {
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
