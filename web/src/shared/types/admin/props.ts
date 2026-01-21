import { UserResponse } from "@/shared/types/user";
import { ProfileRequestWithFullData } from "@/shared/types/profile";
import { PlatformStat, RecentActivity, Notification } from "./dashboard";
import { ActiveProject } from "@/shared/types/project";
import { FinancialData } from "@/shared/types/finance";
import { Order } from "@/shared/types/order";
import { Payment } from "@/shared/types/payment";
import { AnalyticsData } from "./analytics";
import { UsersSubTab, ProjectsSubTab, OrdersSubTab, PaymentsSubTab, SidebarItem } from "./index";

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
    pendingProviders: ProfileRequestWithFullData[];
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
