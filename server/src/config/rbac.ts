import { AdminPrivilege, UserRole } from "../enum/UserRole";

// Define role-based privileges
const ROLE_PRIVILEGES: Record<UserRole, string[]> = {
    [UserRole.SUPER_ADMIN]: [
        AdminPrivilege.OPERATIONS,
        AdminPrivilege.USERS,
        AdminPrivilege.PROFILES,
        AdminPrivilege.SERVICES,
        AdminPrivilege.PAYMENTS,
        AdminPrivilege.SUBSCRIPTIONS,
        AdminPrivilege.SETTINGS,
        AdminPrivilege.REPORTS,
    ],
    [UserRole.ADMIN]: [], // Admins have privileges defined per-user in DB
    [UserRole.PROVIDER]: [],
    [UserRole.PENDING_PROVIDER]: [],
    [UserRole.REJECTED_PROVIDER]: [],
    [UserRole.SUSPENDED_PROVIDER]: [],
    [UserRole.CLIENT]: [],

};

// Define allowed tabs per role
const ROLE_TABS: Record<UserRole, string[]> = {
    [UserRole.SUPER_ADMIN]: [
        "operations",
        "users",
        "profiles",
        "services",
        "payments",
        "subscriptions",
        "settings",
        "reports",
    ],
    [UserRole.ADMIN]: [], // Tabs defined by user privileges in database
    [UserRole.PROVIDER]: ["profile", "operations", "proposals", "services"],
    [UserRole.PENDING_PROVIDER]: ["profile"],
    [UserRole.REJECTED_PROVIDER]: ["profile"],
    [UserRole.SUSPENDED_PROVIDER]: ["profile"],
    [UserRole.CLIENT]: ["operations", "services", "profile"],

};

/**
 * Get all privileges for a given role
 * @param role User role
 * @param dbPrivileges Privileges from database (for ADMIN role) - array of {name: string} objects
 * @returns Array of privilege names
 */
export function getRolePrivileges(
    role: UserRole | string,
    dbPrivileges: string[] = []
): string[] {
    if (role === UserRole.SUPER_ADMIN) {
        return ROLE_PRIVILEGES[UserRole.SUPER_ADMIN];
    }

    if (role === UserRole.ADMIN) {
        // Return privileges from database
        return dbPrivileges;
    }

    return ROLE_PRIVILEGES[role as UserRole] || [];
}

/**
 * Get allowed tabs for a given role
 * @param role User role
 * @param dbPrivileges Privileges from database (for ADMIN role)
 * @returns Array of tab names
 */
export function getRoleAllowedTabs(
    role: UserRole | string,
    dbPrivileges: string[] = []
): string[] {
    if (role === UserRole.SUPER_ADMIN) {
        return ROLE_TABS[UserRole.SUPER_ADMIN];
    }

    if (role === UserRole.ADMIN) {
        // Map admin privileges to tabs
        const privilegeToTabMap: Record<string, string> = {
            [AdminPrivilege.OPERATIONS]: "operations",
            [AdminPrivilege.USERS]: "users",
            [AdminPrivilege.PROFILES]: "profiles",
            [AdminPrivilege.SERVICES]: "services",
            [AdminPrivilege.PAYMENTS]: "payments",
            [AdminPrivilege.SUBSCRIPTIONS]: "subscriptions",
            [AdminPrivilege.SETTINGS]: "settings",
            [AdminPrivilege.REPORTS]: "reports",
        };

        return dbPrivileges
            .map((priv) => privilegeToTabMap[priv])
            .filter((tab) => tab !== undefined);
    }

    return ROLE_TABS[role as UserRole] || [];
}

/**
 * Check if a user has a specific privilege
 * @param role User role
 * @param privilege Privilege to check
 * @param dbPrivileges Privileges from database (for ADMIN role)
 * @returns true if user has the privilege
 */
export function hasPrivilege(
    role: UserRole | string,
    privilege: AdminPrivilege | string,
    dbPrivileges: string[] = []
): boolean {
    const privileges = getRolePrivileges(role as UserRole, dbPrivileges);
    return privileges.includes(privilege as string);
}
