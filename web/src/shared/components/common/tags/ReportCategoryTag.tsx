import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type ReportCategory = "FRAUD" | "ABUSE" | "SERVICE_FAILURE" | "POLICY_VIOLATION" | "TECHNICAL";

export interface ReportCategoryTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    category: ReportCategory;
    size?: TagSize;
}

const categoryConfig: Record<ReportCategory, { label: string; colorScheme: ColorScheme }> = {
    FRAUD: { label: "Fraud", colorScheme: "rose" },
    ABUSE: { label: "Abuse", colorScheme: "orange" },
    SERVICE_FAILURE: { label: "Service Failure", colorScheme: "warning" },
    POLICY_VIOLATION: { label: "Policy Violation", colorScheme: "violet" },
    TECHNICAL: { label: "Technical", colorScheme: "teal" },
};

export function ReportCategoryTag({ category, size, className, ...props }: ReportCategoryTagProps) {
    const config = categoryConfig[category] || { label: category, colorScheme: "neutral" as ColorScheme };

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
