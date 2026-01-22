"use client";

import { useState, createContext, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Bell,
    ChevronDown,
    Database,
    LogOut,
    Menu,
    PanelLeft,
    Search,
    Settings,
    UserCheck,
    X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import Button from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { useToast } from "@/shared/components/ui/use-toast";
import { userService } from "@/shared/services";
import { profileService } from "@/shared/services";
import { UserResponse } from "@/shared/types/user";
import { ProfileRequestWithFullData } from "@/shared/types/profile";

import { sidebarItems, notificationsData, ordersData, paymentsData } from "@/features/admin/data/mockData";
import { Order } from "@/shared/types/order";
import { Payment } from "@/shared/types/payment";

// Create a context to share state between layout and pages

export interface AdminContextType {
    // User management
    users: UserResponse[];
    usersLoading: boolean;
    fetchUsers: () => Promise<void>;
    pendingProviders: ProfileRequestWithFullData[];
    pendingProvidersLoading: boolean;
    fetchPendingProviders: () => Promise<void>;

    // Orders and payments
    orders: Order[];
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
    payments: Payment[];
    setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;

    // Handlers
    handleExportData: (type: string) => void;
    handleApproveProvider: (requestId: string) => Promise<void>;
    handleRejectProvider: (requestId: string) => Promise<void>;
}

export const AdminContext = createContext<AdminContextType | null>(null);

export const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdminContext must be used within AdminLayout");
    }
    return context;
};

export default function AdminLayout() {
    const [notifications] = useState(notificationsData.length);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    // Data state
    const [orders, setOrders] = useState<Order[]>(ordersData);
    const [payments, setPayments] = useState<Payment[]>(paymentsData);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [pendingProviders, setPendingProviders] = useState<ProfileRequestWithFullData[]>([]);
    const [pendingProvidersLoading, setPendingProvidersLoading] = useState(false);

    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // Get current page from URL
    const currentPage = location.pathname.split("/").pop() || "dashboard";

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch users.",
                variant: "destructive",
            });
        } finally {
            setUsersLoading(false);
        }
    };

    const fetchPendingProviders = async () => {
        setPendingProvidersLoading(true);
        try {
            const data = await profileService.getPendingProfileRequestsWithFullData();
            setPendingProviders(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch pending provider requests.",
                variant: "destructive",
            });
        } finally {
            setPendingProvidersLoading(false);
        }
    };

    const handleApproveProvider = async (requestId: string) => {
        try {
            await profileService.evaluateProfileRequest(requestId, "APPROVED", "Application approved by admin.");
            toast({
                title: "Provider Approved",
                description: "Provider application has been approved successfully.",
            });
            fetchPendingProviders();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve provider.",
                variant: "destructive",
            });
        }
    };

    const handleRejectProvider = async (requestId: string) => {
        try {
            await profileService.evaluateProfileRequest(requestId, "REJECTED", "Application rejected by admin.");
            toast({
                title: "Provider Rejected",
                description: "Provider application has been rejected.",
            });
            fetchPendingProviders();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject provider.",
                variant: "destructive",
            });
        }
    };

    const handleExportData = (type: string) => {
        toast({
            title: "Export started",
            description: `Your ${type} data is being prepared for download.`,
        });
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const toggleExpanded = (title: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    const mapTitleToRoute = (title: string): string => {
        const key = title.toLowerCase();
        if (key.includes("dashboard")) return "/admin/dashboard";
        if (key.includes("user")) return "/admin/users";
        if (key.includes("project")) return "/admin/projects";
        if (key.includes("order")) return "/admin/orders";
        if (key.includes("payment")) return "/admin/payments";
        if (key.includes("analytic")) return "/admin/analytics";
        if (key.includes("setting")) return "/admin/settings";
        return "/admin/dashboard";
    };

    const isActiveRoute = (title: string): boolean => {
        const route = mapTitleToRoute(title);
        return location.pathname === route || location.pathname.startsWith(route + "/");
    };

    // Sidebar component
    const renderSidebar = (isMobile: boolean) => (
        <div className="flex h-full flex-col">
            <div className={cn("flex items-center gap-3 p-4 border-b border-slate-200", isMobile && "justify-between")}>
                <div className="flex items-center gap-3">
                    <img src="/logo/no-violet-cut.png" alt="" className="w-[6rem] h-[5rem]" />
                    <div>
                        <h2 className="font-semibold text-slate-800">Admin Panel</h2>
                        <p className="text-xs text-slate-500">Platform Management</p>
                    </div>
                </div>
                {isMobile && (
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            <div className="px-3 py-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full rounded-2xl bg-slate-100 pl-9 pr-4 py-2 border-slate-200"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 px-3 py-2">
                <div className="space-y-1">
                    {sidebarItems.map((item) => (
                        <div key={item.title} className="mb-1">
                            <button
                                className={cn(
                                    "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium text-slate-700",
                                    isActiveRoute(item.title)
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "hover:bg-slate-100"
                                )}
                                onClick={() => {
                                    const route = mapTitleToRoute(item.title);
                                    if (route !== "/admin/dashboard" || item.title.toLowerCase().includes("dashboard")) {
                                        handleNavigation(route);
                                    }
                                    if (item.items) {
                                        toggleExpanded(item.title);
                                    }
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span>{item.title}</span>
                                </div>
                                {item.badge && (
                                    <Badge
                                        variant="secondary"
                                        className="ml-auto rounded-full px-2 py-0.5 text-xs bg-slate-200 text-slate-600"
                                    >
                                        {item.badge}
                                    </Badge>
                                )}
                                {item.items && (
                                    <ChevronDown
                                        className={cn(
                                            "ml-2 h-4 w-4 transition-transform",
                                            expandedItems[item.title] ? "rotate-180" : ""
                                        )}
                                    />
                                )}
                            </button>

                            {item.items && expandedItems[item.title] && (
                                <div className="mt-1 ml-6 space-y-1 border-l border-slate-200 pl-3">
                                    {item.items.map((subItem) => (
                                        <button
                                            key={subItem.title}
                                            className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 w-full text-left"
                                            onClick={() => {
                                                const route = mapTitleToRoute(item.title);
                                                handleNavigation(route);
                                            }}
                                        >
                                            {subItem.title}
                                            {subItem.badge && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-auto rounded-full px-2 py-0.5 text-xs bg-slate-200 text-slate-600"
                                                >
                                                    {subItem.badge}
                                                </Badge>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="border-t border-slate-200 p-3">
                <div className="space-y-1">
                    <button
                        className={cn(
                            "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100",
                            currentPage === "settings" && "bg-indigo-50 text-indigo-700"
                        )}
                        onClick={() => handleNavigation("/admin/settings")}
                    >
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                    </button>
                    <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <span>Admin User</span>
                        </div>
                        <Badge variant="outline" className="ml-auto border-slate-300">
                            Super
                        </Badge>
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-rose-50 text-rose-600">
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const contextValue: AdminContextType = {
        users,
        usersLoading,
        fetchUsers,
        pendingProviders,
        pendingProvidersLoading,
        fetchPendingProviders,
        orders,
        setOrders,
        payments,
        setPayments,
        handleExportData,
        handleApproveProvider,
        handleRejectProvider,
    };

    return (
        <AdminContext.Provider value={contextValue}>
            <div className="relative min-h-screen overflow-hidden bg-white">
                {/* Animated gradient background */}
                <motion.div
                    className="absolute inset-0 -z-10 opacity-10"
                    animate={{
                        background: [
                            "radial-gradient(circle at 50% 50%, rgba(88, 80, 236, 0.3) 0%, rgba(109, 40, 217, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
                            "radial-gradient(circle at 30% 70%, rgba(2, 132, 199, 0.3) 0%, rgba(109, 40, 217, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
                            "radial-gradient(circle at 70% 30%, rgba(5, 150, 105, 0.3) 0%, rgba(88, 80, 236, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
                            "radial-gradient(circle at 50% 50%, rgba(88, 80, 236, 0.3) 0%, rgba(109, 40, 217, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
                        ],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                />

                {/* Mobile menu overlay */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar - Mobile */}
                <div
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out md:hidden border-r border-slate-200",
                        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    {renderSidebar(true)}
                </div>

                {/* Sidebar - Desktop */}
                <div
                    className={cn(
                        "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:block",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    {renderSidebar(false)}
                </div>

                {/* Main Content */}
                <div
                    className={cn(
                        "min-h-screen bg-white transition-all duration-300 ease-in-out",
                        sidebarOpen ? "md:pl-64" : "md:pl-0"
                    )}
                >
                    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-lg">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden md:flex"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <PanelLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex flex-1 items-center justify-between">
                            <h1 className="text-xl font-semibold text-slate-800 capitalize">
                                Admin {currentPage}
                            </h1>
                            <div className="flex items-center gap-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full">
                                                <Database className="h-5 w-5" />
                                            </Button>
                                        </TooltipTrigger>
                                    </Tooltip>
                                </TooltipProvider>

                                {/* Notification dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full relative cursor-pointer"
                                        >
                                            <Bell className="h-5 w-5" />
                                            {notifications > 0 && (
                                                <span className="focus:border-none absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
                                                    {notifications}
                                                </span>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-300">
                                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {notificationsData.map((notif) => (
                                            <DropdownMenuItem key={notif.id} className="flex items-start gap-2">
                                                {notif.icon}
                                                <div className="flex-1">
                                                    <p className="text-sm leading-tight">{notif.text}</p>
                                                    <p className="text-xs text-slate-500">{notif.time}</p>
                                                </div>
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="justify-center">
                                            View all notifications
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Account dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-100 focus:border-none cursor-pointer">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage
                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format?height=40&width=40"
                                                    alt="Admin"
                                                />
                                            </Avatar>
                                            <div className="hidden text-left lg:block">
                                                <p className="text-sm font-semibold text-slate-800">Admin User</p>
                                                <p className="text-xs text-slate-500">Super Admin</p>
                                            </div>
                                            <ChevronDown className="h-4 w-4 text-slate-500 hidden lg:block mr-1" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-300">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleNavigation("/admin/settings")}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 p-4 md:p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </AdminContext.Provider>
    );
}
