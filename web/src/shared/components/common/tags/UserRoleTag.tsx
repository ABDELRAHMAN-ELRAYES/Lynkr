import * as React from "react";
import { StatusTag, type ColorScheme, type TagSize } from "./StatusTag";
import { cn } from "@/shared/lib/utils";

export type UserRole = "CLIENT" | "PROVIDER" | "ADMIN" | "SUPER_ADMIN";

export interface UserRoleTagProps extends React.HTMLAttributes<HTMLSpanElement> {
    role: UserRole;
    size?: TagSize;
}

const roleConfig: Record<UserRole, { label: string; colorScheme: ColorScheme }> = {
    CLIENT: { label: "Client", colorScheme: "info" },
    PROVIDER: { label: "Provider", colorScheme: "success" },
    ADMIN: { label: "Admin", colorScheme: "purple" },
    SUPER_ADMIN: { label: "Super Admin", colorScheme: "error" },
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
