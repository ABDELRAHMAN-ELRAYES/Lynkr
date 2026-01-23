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
    | "cyan"
    | "sky"
    | "violet"
    | "blue"
    | "rose"
    | "indigo"
    | "pink"
    | "teal";

export type TagSize = "sm" | "md" | "lg";

export interface StatusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    colorScheme?: ColorScheme;
    size?: TagSize;
    children: React.ReactNode;
}

const colorSchemeStyles: Record<ColorScheme, string> = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    error: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    primary: "bg-indigo-50 text-indigo-700 border-indigo-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    orange: "bg-orange-50 text-orange-800 border-orange-200",
    cyan: "bg-cyan-50 text-cyan-800 border-cyan-200",
    // New colors
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    pink: "bg-pink-50 text-pink-700 border-pink-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
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
                "inline-flex items-center font-medium rounded-2xl border",
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
