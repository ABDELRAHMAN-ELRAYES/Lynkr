import * as React from "react";
import { cn } from "@/shared/lib/utils";

export type ColorScheme =
    | "success"
    | "warning"
    | "error"
    | "info"
    | "neutral"
    | "primary"
    | "purple"
    | "emerald"
    | "orange"
    | "cyan";

export type TagSize = "sm" | "md" | "lg";

export interface StatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    colorScheme?: ColorScheme;
    size?: TagSize;
    children: React.ReactNode;
}

const colorSchemeStyles: Record<ColorScheme, string> = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    neutral: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-indigo-100 text-indigo-800 border-indigo-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
    emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    cyan: "bg-cyan-100 text-cyan-800 border-cyan-200",
};

const sizeStyles: Record<TagSize, string> = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-xs",
    lg: "px-2.5 py-1.5 text-sm",
};

export function StatusTag({
    colorScheme = "neutral",
    size = "md",
    className,
    children,
    ...props
}: StatusTagProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center font-medium rounded-md border",
                colorSchemeStyles[colorScheme],
                sizeStyles[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
