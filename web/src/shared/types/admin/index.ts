import { ReactNode } from "react";

// User-related types
export interface MockUser {
    id: number;
    name: string;
    email: string;
    avatar: string;
    role: string;
    status: string;
    joinDate: string;
    lastActive: string;
    projects: number;
    totalSpent: string;
    totalEarned: string;
    location: string;
    phone: string;
    verified: boolean;
    rating: number;
    completedProjects: number;
}

// Sidebar types
export interface SidebarSubItem {
    title: string;
    url: string;
    badge?: string;
}

export interface SidebarItem {
    title: string;
    icon: ReactNode;
    isActive?: boolean;
    url?: string;
    badge?: string;
    items?: SidebarSubItem[];
}

// Support ticket types
export interface SupportTicket {
    id: number;
    subject: string;
    status: string;
    priority: string;
    user: string;
    date: string;
}

// Tab types
export type UsersSubTab = "all" | "active" | "pending" | "suspended" | "provider-requests";
export type OrdersSubTab = "all" | "new" | "in-progress" | "completed" | "refunds";
export type PaymentsSubTab = "all" | "transactions" | "pending" | "refunded" | "reports";
export type ProjectsSubTab = "all" | "active" | "completed" | "on-hold" | "templates";
export type ActiveTab = "dashboard" | "users" | "projects" | "orders" | "payments" | "analytics" | "settings";
