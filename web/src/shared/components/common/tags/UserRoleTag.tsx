import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type UserRole =
    | "CLIENT"
    | "PENDING_PROVIDER"
    | "PROVIDER"
    | "REJECTED_PROVIDER"
    | "SUSPENDED_PROVIDER"
    | "ADMIN"
    | "SUPER_ADMIN";

export interface UserRoleTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    role: UserRole;
    size?: TagSize;
}

const roleConfig: Record<UserRole, { label: string; colorScheme: ColorScheme }> = {
    CLIENT: { label: "Client", colorScheme: "sky" },
    PENDING_PROVIDER: { label: "Provider (Pending)", colorScheme: "warning" },
    PROVIDER: { label: "Provider", colorScheme: "emerald" },
    REJECTED_PROVIDER: { label: "Provider (Rejected)", colorScheme: "rose" },
    SUSPENDED_PROVIDER: { label: "Provider (Suspended)", colorScheme: "rose" },
    ADMIN: { label: "Admin", colorScheme: "violet" },
    SUPER_ADMIN: { label: "Super Admin", colorScheme: "purple" },
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
