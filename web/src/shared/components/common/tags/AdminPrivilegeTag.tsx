import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export enum AdminPrivilege {
    OPERATIONS = "OPERATIONS",
    USERS = "USERS",
    PROFILES = "PROFILES",
    SERVICES = "SERVICES",
    PAYMENTS = "PAYMENTS",
    SUBSCRIPTIONS = "SUBSCRIPTIONS",
    SETTINGS = "SETTINGS",
    REPORTS = "REPORTS",
}

export interface AdminPrivilegeTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    privilege: AdminPrivilege | string;
    size?: TagSize;
}

const privilegeConfig: Record<string, { label: string; colorScheme: ColorScheme }> = {
    [AdminPrivilege.OPERATIONS]: { label: "Operations", colorScheme: "cyan" },
    [AdminPrivilege.USERS]: { label: "Users", colorScheme: "violet" },
    [AdminPrivilege.PROFILES]: { label: "Profiles", colorScheme: "blue" },
    [AdminPrivilege.SERVICES]: { label: "Services", colorScheme: "teal" },
    [AdminPrivilege.PAYMENTS]: { label: "Payments", colorScheme: "emerald" },
    [AdminPrivilege.SUBSCRIPTIONS]: { label: "Subscriptions", colorScheme: "orange" },
    [AdminPrivilege.SETTINGS]: { label: "Settings", colorScheme: "neutral" },
    [AdminPrivilege.REPORTS]: { label: "Reports", colorScheme: "rose" },
};

export function AdminPrivilegeTag({ privilege, size, className, ...props }: AdminPrivilegeTagProps) {
    const config = privilegeConfig[privilege] || { label: privilege, colorScheme: "neutral" as ColorScheme };

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
