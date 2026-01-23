import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type UserRole =
    | "CLIENT"
    | "PROVIDER_PENDING"
    | "PROVIDER_APPROVED"
    | "PROVIDER_REJECTED"
    | "PROVIDER_SUSPENDED"
    | "ADMIN"
    | "SUPER_ADMIN"
    | "PENDING_PROVIDER"
    | "REJECTED_PROVIDER";

export interface UserRoleTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    role: UserRole;
    size?: TagSize;
}

const roleConfig: Record<UserRole, { label: string; colorScheme: ColorScheme }> = {
    CLIENT: { label: "Client", colorScheme: "sky" },
    PROVIDER_PENDING: { label: "Provider (Pending)", colorScheme: "warning" },
    PROVIDER_APPROVED: { label: "Provider (Approved)", colorScheme: "emerald" },
    PROVIDER_REJECTED: { label: "Provider (Rejected)", colorScheme: "rose" },
    PROVIDER_SUSPENDED: { label: "Provider (Suspended)", colorScheme: "rose" },
    ADMIN: { label: "Admin", colorScheme: "violet" },
    SUPER_ADMIN: { label: "Super Admin", colorScheme: "purple" },
    PENDING_PROVIDER: { label: "Pending Provider", colorScheme: "warning" },
    REJECTED_PROVIDER: { label: "Rejected Provider", colorScheme: "error" },
};

export function UserRoleTag({ role, size, className, ...props }: UserRoleTagProps) {
    const config = roleConfig[role] || { label: role, colorScheme: "neutral" as ColorScheme };

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
