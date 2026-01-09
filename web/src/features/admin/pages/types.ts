import { ReactNode } from "react";
import { UserResponse } from "@/shared/services";
import { ProfileRequestWithUser } from "@/shared/services/profileService";

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

// Stats and metrics types
export interface PlatformStat {
    title: string;
    value: string;
    change: string;
    icon: ReactNode;
    trend: "up" | "down";
    bgColor: string;
}

export interface RecentActivity {
    id: number;
    type: string;
    user: string;
    action: string;
    time: string;
    status: string;
    icon: ReactNode;
    avatar?: string;
}

export interface Notification {
    id: number;
    icon: ReactNode;
    text: string;
    time: string;
}

// Project types
export interface ActiveProject {
    id: string;
    name: string;
    client: string;
    provider: string;
    status: "in_progress" | "review" | "completed" | "dispute";
    progress: number;
    budget: string;
    deadline: string;
    priority: "high" | "medium" | "low";
}

// Financial types
export interface FinancialData {
    period: string;
    revenue: string;
    commissions: string;
    refunds: string;
    net: string;
}

// Financial overview for dashboard
export interface FinancialOverview {
    totalRevenue: string;
    monthlyRevenue: string;
    transactions: string;
    pendingPayouts: string;
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

// Order types
export interface Order {
    id: string;
    client: string;
    service: string;
    amount: string;
    status: string;
    date: string;
    priority: string;
}

// Payment types
export interface Payment {
    id: string;
    client: string;
    amount: string;
    status: string;
    date: string;
    method: string;
}

// Analytics types
export interface AnalyticsData {
    users: {
        total: number;
        growth: number;
        active: number;
        new: number;
    };
    revenue: {
        total: number;
        growth: number;
        average: number;
        projected: number;
    };
    projects: {
        total: number;
        growth: number;
        completed: number;
        active: number;
    };
    engagement: {
        rate: number;
        growth: number;
        duration: string;
        pages: number;
    };
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

// Component props types
export interface DashboardTabProps {
    platformStats: PlatformStat[];
    recentActivities: RecentActivity[];
    activeProjects: ActiveProject[];
    financialData: FinancialData[];
    getPriorityColor: (priority: string) => string;
}

export interface UsersTabProps {
    users: UserResponse[];
    usersLoading: boolean;
    userSearch: string;
    setUserSearch: (search: string) => void;
    userFilter: string;
    setUserFilter: (filter: string) => void;
    usersSubTab: UsersSubTab;
    setUsersSubTab: (tab: UsersSubTab) => void;
    selectedUser: UserResponse | null;
    setSelectedUser: (user: UserResponse | null) => void;
    isEditingUser: boolean;
    setIsEditingUser: (editing: boolean) => void;
    editUserData: any;
    setEditUserData: (data: any) => void;
    isCreatingUser: boolean;
    setIsCreatingUser: (creating: boolean) => void;
    createUserData: any;
    setCreateUserData: (data: any) => void;
    pendingProviders: ProfileRequestWithUser[];
    pendingProvidersLoading: boolean;
    handleCreateUser: () => void;
    handleEditUser: (user: any) => void;
    handleSaveUser: () => void;
    handleApproveUser: (user: any) => void;
    handleSuspendUser: (user: any) => void;
    handleDeleteUser: (userId: string) => void;
    handleApproveProvider: (requestId: string) => void;
    handleRejectProvider: (requestId: string) => void;
    handleExportData: (type: string) => void;
    getStatusColor: (status: string) => string;
    getRoleColor: (role: string) => string;
}

export interface ProjectsTabProps {
    activeProjects: ActiveProject[];
    projectsSubTab: ProjectsSubTab;
    setProjectsSubTab: (tab: ProjectsSubTab) => void;
    handleExportData: (type: string) => void;
    getPriorityColor: (priority: string) => string;
}

export interface OrdersTabProps {
    orders: Order[];
    ordersSubTab: OrdersSubTab;
    setOrdersSubTab: (tab: OrdersSubTab) => void;
    handleUpdateOrderStatus: (orderId: string, status: string) => void;
    handleExportData: (type: string) => void;
    getPriorityColor: (priority: string) => string;
}

export interface PaymentsTabProps {
    payments: Payment[];
    paymentsSubTab: PaymentsSubTab;
    setPaymentsSubTab: (tab: PaymentsSubTab) => void;
    handleUpdatePaymentStatus: (paymentId: string, status: string) => void;
    handleExportData: (type: string) => void;
    getPaymentStatusColor: (status: string) => string;
}

export interface AnalyticsTabProps {
    analyticsData: AnalyticsData;
    analyticsTimeRange: string;
    setAnalyticsTimeRange: (range: string) => void;
    handleExportData: (type: string) => void;
}

export interface SidebarProps {
    sidebarItems: SidebarItem[];
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    activeTab: string;
    expandedItems: Record<string, boolean>;
    toggleExpanded: (title: string) => void;
    handleNavigation: (url: string, subTab?: string) => void;
    allowedTabs: Set<string>;
    mapTitleToTopTab: (title: string) => string | undefined;
    normalizeTab: (key: string) => string;
}

export interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    setMobileMenuOpen: (open: boolean) => void;
    notifications: number;
    notificationsData: Notification[];
}
