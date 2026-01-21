"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    Ban,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Edit,
    Eye,
    Filter,
    Mail,
    MapPin,
    MoreHorizontal,
    Search,
    Trash2,
    UserCheck,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import Button from "@/shared/components/ui/Button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/shared/lib/utils";
import { useToast } from "@/shared/components/ui/use-toast";
import { userService, UserResponse } from "@/shared/services";
import { useAdminContext } from "./AdminLayout";
import { usersData as mockUsersData } from "./mockData";
import { getStatusColor, getRoleColor } from "./utils.tsx";

// Available user roles from backend
const USER_ROLES = [
    { value: "CLIENT", label: "Client" },
    { value: "PROVIDER", label: "Provider" },
    { value: "PENDING_PROVIDER", label: "Pending Provider" },
    { value: "ADMIN", label: "Admin" },
    { value: "SUPER_ADMIN", label: "Super Admin" },
] as const;

type UsersSubTab = "all" | "active" | "pending" | "suspended" | "provider-requests";

export default function UsersPage() {
    const {
        users,
        fetchUsers,
        pendingProviders,
        pendingProvidersLoading,
        fetchPendingProviders,
        handleApproveProvider,
        handleRejectProvider,
        handleExportData,
    } = useAdminContext();

    const { toast } = useToast();

    const [userFilter, setUserFilter] = useState("all");
    const [userSearch, setUserSearch] = useState("");
    const [usersSubTab, setUsersSubTab] = useState<UsersSubTab>("all");
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [editUserData, setEditUserData] = useState<any>(null);
    const [selectedProviderRequest, setSelectedProviderRequest] = useState<any>(null);

    // Create user state
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [createUserData, setCreateUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        country: "",
        role: "CLIENT" as string,
        isActive: true,
    });
    const [createUserLoading, setCreateUserLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (usersSubTab === "provider-requests") {
            fetchPendingProviders();
        }
    }, [usersSubTab]);

    const handleEditUser = (user: UserResponse) => {
        setEditUserData({ ...user });
        setIsEditingUser(true);
        setSelectedUser(user);
    };

    const handleSaveUser = async () => {
        if (!editUserData) return;
        try {
            await userService.updateUser(editUserData.id, {
                firstName: editUserData.first_name,
                lastName: editUserData.last_name,
                email: editUserData.email,
                country: editUserData.country,
                role: editUserData.role,
                isActive: editUserData.is_active,
            });
            toast({
                title: "User updated",
                description: `${editUserData.first_name} ${editUserData.last_name}'s profile has been updated.`,
            });
            setIsEditingUser(false);
            setEditUserData(null);
            fetchUsers();
        } catch (error) {
            toast({ title: "Error", description: "Failed to update user.", variant: "destructive" });
        }
    };

    const handleApproveUser = async (user: UserResponse) => {
        try {
            await userService.updateUser(user.id, {
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                country: user.country,
                role: user.role,
                isActive: true,
            });
            toast({ title: "User approved", description: "User account has been activated." });
            fetchUsers();
        } catch (error) {
            toast({ title: "Error", description: "Failed to activate user.", variant: "destructive" });
        }
    };

    const handleSuspendUser = async (user: UserResponse) => {
        try {
            await userService.updateUser(user.id, {
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                country: user.country,
                role: user.role,
                isActive: false,
            });
            toast({ title: "User suspended", description: "User account has been suspended." });
            fetchUsers();
        } catch (error) {
            toast({ title: "Error", description: "Failed to suspend user.", variant: "destructive" });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await userService.deleteUser(userId);
            toast({ title: "User deleted", description: "User account has been deleted." });
            fetchUsers();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" });
        }
    };

    // Create new user
    const handleCreateUser = async () => {
        // Validate required fields
        if (!createUserData.firstName || !createUserData.lastName || !createUserData.email || !createUserData.password) {
            toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }
        if (createUserData.firstName.length < 3 || createUserData.firstName.length > 50) {
            toast({ title: "Validation Error", description: "First name must be between 3 and 50 characters.", variant: "destructive" });
            return;
        }
        if (createUserData.lastName.length < 3 || createUserData.lastName.length > 50) {
            toast({ title: "Validation Error", description: "Last name must be between 3 and 50 characters.", variant: "destructive" });
            return;
        }
        if (createUserData.password.length < 8) {
            toast({ title: "Validation Error", description: "Password must be at least 8 characters.", variant: "destructive" });
            return;
        }

        setCreateUserLoading(true);
        try {
            await userService.createUser(createUserData);
            toast({ title: "User created", description: `${createUserData.firstName} ${createUserData.lastName} has been created successfully.` });
            setIsCreatingUser(false);
            setCreateUserData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                country: "",
                role: "CLIENT",
                isActive: true,
            });
            fetchUsers();
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "Failed to create user.", variant: "destructive" });
        } finally {
            setCreateUserLoading(false);
        }
    };

    // Filter users
    const effectiveUserFilter = usersSubTab !== "all" ? usersSubTab : userFilter;
    const filteredUsers = users.filter((user) => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
        const matchesSearch =
            fullName.includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase());
        const userStatus = user.is_active ? "active" : "suspended";
        const matchesFilter =
            effectiveUserFilter === "all" ||
            userStatus === effectiveUserFilter ||
            user.role.toLowerCase() === effectiveUserFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            <section>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-8 text-white shadow-lg"
                >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                            <Badge className="bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/20">
                                User Management
                            </Badge>
                            <h2 className="text-3xl font-bold">
                                {usersSubTab === "active" ? "Active Users" :
                                    usersSubTab === "pending" ? "Pending Approval" :
                                        usersSubTab === "suspended" ? "Suspended Users" :
                                            usersSubTab === "provider-requests" ? "Provider Requests" : "All Users"}
                            </h2>
                            <p className="max-w-[600px] text-white/80">
                                Manage all users, their roles, status, and activities across the platform.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    className="rounded-2xl bg-white text-emerald-700 hover:bg-white/90 shadow"
                                    onClick={() => setIsCreatingUser(true)}
                                >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add User
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-2xl bg-transparent border-white/50 text-white hover:bg-white/10"
                                    onClick={() => handleExportData("users")}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Users
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{mockUsersData.length}</div>
                        <p className="text-xs text-slate-500"><span className="text-emerald-600">+2</span> new this week</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Users</CardTitle>
                        <Activity className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            {mockUsersData.filter((u) => u.status === "active").length}
                        </div>
                        <p className="text-xs text-slate-500">
                            {Math.round((mockUsersData.filter((u) => u.status === "active").length / mockUsersData.length) * 100)}% of total
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Providers</CardTitle>
                        <UserCheck className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            {mockUsersData.filter((u) => u.role === "Provider").length}
                        </div>
                        <p className="text-xs text-slate-500">
                            {mockUsersData.filter((u) => u.role === "Provider" && u.status === "active").length} active
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Pending Approval</CardTitle>
                        <Clock className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            {mockUsersData.filter((u) => u.status === "pending").length}
                        </div>
                        <p className="text-xs text-slate-500">Require review</p>
                    </CardContent>
                </Card>
            </section>

            <section className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <Select
                            value={usersSubTab !== "all" ? usersSubTab : userFilter}
                            onValueChange={(v) => {
                                if (["active", "pending", "suspended", "provider-requests", "all"].includes(v)) {
                                    setUsersSubTab(v as UsersSubTab);
                                    setUserFilter(v);
                                }
                            }}
                        >
                            <SelectTrigger className="w-[180px] rounded-2xl bg-white border-slate-300">
                                <SelectValue placeholder="Filter users" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="provider-requests">Provider Requests</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" className="rounded-2xl bg-white border-slate-300 text-slate-700 hover:bg-slate-100">
                            <Filter className="mr-2 h-4 w-4" />
                            More Filters
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Search users..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="w-full rounded-2xl pl-9 bg-white border-slate-300"
                            />
                        </div>
                    </div>
                </div>

                {usersSubTab === "provider-requests" ? (
                    <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-800">Pending Provider Applications</CardTitle>
                            <CardDescription>Review and approve or reject provider registration requests</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {pendingProvidersLoading ? (
                                <div className="p-8 text-center text-slate-500">Loading pending providers...</div>
                            ) : pendingProviders.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">No pending provider requests</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b-slate-200">
                                            <TableHead className="p-4 text-slate-600">Provider</TableHead>
                                            <TableHead className="p-4 text-slate-600">Email</TableHead>
                                            <TableHead className="p-4 text-slate-600">Request Type</TableHead>
                                            <TableHead className="p-4 text-slate-600">Applied</TableHead>
                                            <TableHead className="p-4 text-slate-600">Status</TableHead>
                                            <TableHead className="p-4 text-right text-slate-600">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingProviders.map((request, index) => (
                                            <TableRow key={request.id} className={cn("border-b-slate-200/80", index % 2 !== 0 && "bg-slate-50/50")}>
                                                <TableCell className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-slate-200">
                                                            <AvatarFallback>{request.user?.firstName?.[0]}{request.user?.lastName?.[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="font-semibold text-slate-800">
                                                            {request.user?.firstName} {request.user?.lastName}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-4 text-sm text-slate-600">{request.user?.email || "N/A"}</TableCell>
                                                <TableCell className="p-4">
                                                    <Badge variant="outline" className="rounded-xl font-medium bg-blue-50 text-blue-800 border-blue-200">
                                                        {request.type === "JOIN_REQUEST" ? "Join Request" : "Update Request"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="p-4 text-sm text-slate-500">
                                                    {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A"}
                                                </TableCell>
                                                <TableCell className="p-4">
                                                    <Badge variant="outline" className="rounded-xl font-medium bg-amber-50 text-amber-800 border-amber-200">
                                                        Pending Review
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="p-4 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button size="sm" variant="outline" className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100"
                                                            onClick={() => setSelectedProviderRequest(request)}>
                                                            <Eye className="mr-1 h-4 w-4" /> View Details
                                                        </Button>
                                                        <Button size="sm" className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                                                            onClick={() => handleApproveProvider(request.id)}>
                                                            <CheckCircle className="mr-1 h-4 w-4" /> Approve
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="rounded-xl border-rose-300 text-rose-600 hover:bg-rose-50"
                                                            onClick={() => handleRejectProvider(request.id)}>
                                                            <Ban className="mr-1 h-4 w-4" /> Reject
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b-slate-200">
                                        <TableHead className="p-4 text-slate-600">User</TableHead>
                                        <TableHead className="p-4 text-slate-600">Role</TableHead>
                                        <TableHead className="p-4 text-slate-600">Status</TableHead>
                                        <TableHead className="p-4 text-slate-600">Country</TableHead>
                                        <TableHead className="p-4 text-slate-600">Joined</TableHead>
                                        <TableHead className="p-4 text-right text-slate-600">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user, index) => (
                                        <TableRow key={user.id} className={cn("border-b-slate-200/80", index % 2 !== 0 && "bg-slate-50/50")}>
                                            <TableCell className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-slate-200">
                                                        <AvatarImage src="/placeholder.svg" alt={`${user.first_name} ${user.last_name}`} />
                                                        <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold text-slate-800">{user.first_name} {user.last_name}</div>
                                                        <div className="text-sm text-slate-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-4">
                                                <Badge variant="outline" className={cn("rounded-xl font-medium", getRoleColor(user.role))}>
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-4">
                                                <Badge variant="outline" className={cn("rounded-xl font-medium", getStatusColor(user.is_active ? "active" : "suspended"))}>
                                                    {user.is_active ? "active" : "suspended"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="p-4 text-sm text-slate-700">{user.country || "N/A"}</TableCell>
                                            <TableCell className="p-4 text-sm text-slate-500">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                                            </TableCell>
                                            <TableCell className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="rounded-xl h-9 w-9 data-[state=open]:bg-slate-100">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit User
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Send Message</DropdownMenuItem>
                                                        {!user.is_active && (
                                                            <DropdownMenuItem onClick={() => handleApproveUser(user)}>
                                                                <CheckCircle className="mr-2 h-4 w-4" /> Activate User
                                                            </DropdownMenuItem>
                                                        )}
                                                        {user.is_active && (
                                                            <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
                                                                <Ban className="mr-2 h-4 w-4" /> Deactivate User
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                                                            onClick={() => handleDeleteUser(user.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* User Detail Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border-slate-200">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 border-2 border-white ring-2 ring-slate-200">
                                        <AvatarImage src="/placeholder.svg" alt={`${selectedUser.first_name} ${selectedUser.last_name}`} />
                                        <AvatarFallback>{selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-xl text-slate-800">{selectedUser.first_name} {selectedUser.last_name}</CardTitle>
                                        <p className="text-slate-500">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setSelectedUser(null); setIsEditingUser(false); }}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isEditingUser ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input id="firstName" value={editUserData?.first_name || ''} onChange={(e) => setEditUserData({ ...editUserData, first_name: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" value={editUserData?.last_name || ''} onChange={(e) => setEditUserData({ ...editUserData, last_name: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" value={editUserData?.email || ''} onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="country">Country</Label>
                                                <Input id="country" value={editUserData?.country || ''} onChange={(e) => setEditUserData({ ...editUserData, country: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-4">
                                            <Button onClick={handleSaveUser} className="rounded-2xl bg-slate-800 text-white hover:bg-slate-700">Save Changes</Button>
                                            <Button variant="outline" className="rounded-2xl" onClick={() => setIsEditingUser(false)}>Cancel</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-slate-500">Role</label>
                                                <Badge variant="outline" className={cn("mt-1 font-medium", getRoleColor(selectedUser.role))}>{selectedUser.role}</Badge>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-500">Status</label>
                                                <Badge variant="outline" className={cn("mt-1 font-medium", getStatusColor(selectedUser.is_active ? "active" : "suspended"))}>
                                                    {selectedUser.is_active ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-slate-500">Country</label>
                                                <div className="flex items-center gap-2 mt-1 text-slate-700"><MapPin className="h-4 w-4" />{selectedUser.country || "N/A"}</div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-500">Joined</label>
                                                <div className="flex items-center gap-2 mt-1 text-slate-700">
                                                    <Calendar className="h-4 w-4" />
                                                    {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-4 border-t border-slate-200 mt-6">
                                            <Button onClick={() => handleEditUser(selectedUser)} className="rounded-2xl bg-slate-800 text-white hover:bg-slate-700">
                                                <Edit className="mr-2 h-4 w-4" /> Edit User
                                            </Button>
                                            <Button variant="outline" className="rounded-2xl"><Mail className="mr-2 h-4 w-4" /> Send Message</Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Create User Modal */}
                {isCreatingUser && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border-slate-200">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div>
                                    <CardTitle className="text-xl text-slate-800">Create New User</CardTitle>
                                    <CardDescription>Fill in the details to create a new user account</CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                    onClick={() => {
                                        setIsCreatingUser(false);
                                        setCreateUserData({
                                            firstName: "",
                                            lastName: "",
                                            email: "",
                                            password: "",
                                            country: "",
                                            role: "CLIENT",
                                            isActive: true,
                                        });
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="create-firstName">First Name *</Label>
                                        <Input
                                            id="create-firstName"
                                            placeholder="Enter first name"
                                            value={createUserData.firstName}
                                            onChange={(e) => setCreateUserData({ ...createUserData, firstName: e.target.value })}
                                        />
                                        <p className="text-xs text-slate-500">3-50 characters required</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="create-lastName">Last Name *</Label>
                                        <Input
                                            id="create-lastName"
                                            placeholder="Enter last name"
                                            value={createUserData.lastName}
                                            onChange={(e) => setCreateUserData({ ...createUserData, lastName: e.target.value })}
                                        />
                                        <p className="text-xs text-slate-500">3-50 characters required</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="create-email">Email *</Label>
                                        <Input
                                            id="create-email"
                                            type="email"
                                            placeholder="user@example.com"
                                            value={createUserData.email}
                                            onChange={(e) => setCreateUserData({ ...createUserData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="create-password">Password *</Label>
                                        <Input
                                            id="create-password"
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            value={createUserData.password}
                                            onChange={(e) => setCreateUserData({ ...createUserData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="create-country">Country</Label>
                                        <Input
                                            id="create-country"
                                            placeholder="e.g., United States"
                                            value={createUserData.country}
                                            onChange={(e) => setCreateUserData({ ...createUserData, country: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="create-role">Role *</Label>
                                        <Select
                                            value={createUserData.role}
                                            onValueChange={(value) => setCreateUserData({ ...createUserData, role: value })}
                                        >
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {USER_ROLES.map((role) => (
                                                    <SelectItem key={role.value} value={role.value}>
                                                        {role.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                                    <div>
                                        <Label htmlFor="create-isActive" className="text-base font-medium">Account Status</Label>
                                        <p className="text-sm text-slate-500">Set whether the account is active upon creation</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-sm font-medium", !createUserData.isActive && "text-slate-500")}>
                                            {createUserData.isActive ? "Active" : "Inactive"}
                                        </span>
                                        <Switch
                                            id="create-isActive"
                                            checked={createUserData.isActive}
                                            onCheckedChange={(checked) => setCreateUserData({ ...createUserData, isActive: checked })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-200">
                                    <Button
                                        onClick={handleCreateUser}
                                        disabled={createUserLoading}
                                        className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
                                    >
                                        {createUserLoading ? (
                                            <>Creating...</>
                                        ) : (
                                            <>
                                                <UserPlus className="mr-2 h-4 w-4" />
                                                Create User
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="rounded-2xl"
                                        onClick={() => {
                                            setIsCreatingUser(false);
                                            setCreateUserData({
                                                firstName: "",
                                                lastName: "",
                                                email: "",
                                                password: "",
                                                country: "",
                                                role: "CLIENT",
                                                isActive: true,
                                            });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Provider Request Detail Modal */}
                {selectedProviderRequest && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border-slate-200">
                            <CardHeader className="flex flex-row items-start justify-between border-b border-slate-200">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 border-2 border-white ring-2 ring-slate-200">
                                        {selectedProviderRequest.profile?.imageUrl ? (
                                            <AvatarImage src={selectedProviderRequest.profile.imageUrl} alt={`${selectedProviderRequest.user?.firstName} ${selectedProviderRequest.user?.lastName}`} />
                                        ) : null}
                                        <AvatarFallback>{selectedProviderRequest.user?.firstName?.[0]}{selectedProviderRequest.user?.lastName?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-xl text-slate-800">
                                            {selectedProviderRequest.user?.firstName} {selectedProviderRequest.user?.lastName}
                                        </CardTitle>
                                        <p className="text-slate-500">{selectedProviderRequest.user?.email}</p>
                                        {selectedProviderRequest.profile?.title && (
                                            <p className="text-sm font-medium text-emerald-600 mt-1">{selectedProviderRequest.profile.title}</p>
                                        )}
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedProviderRequest(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                {/* Profile Information */}
                                {selectedProviderRequest.profile && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Profile Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-slate-500">Service Type</label>
                                                <Badge variant="outline" className="mt-1 font-medium bg-indigo-50 text-indigo-800 border-indigo-200">
                                                    {selectedProviderRequest.profile.serviceType}
                                                </Badge>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-slate-500">Hourly Rate</label>
                                                <p className="text-lg font-semibold text-emerald-600 mt-1">${selectedProviderRequest.profile.hourlyRate}/hr</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Bio</label>
                                            <p className="text-slate-700 mt-1 leading-relaxed">{selectedProviderRequest.profile.bio}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Skills</label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedProviderRequest.profile.skills.split(',').map((skill: string, idx: number) => (
                                                    <Badge key={idx} variant="outline" className="rounded-xl bg-slate-50 text-slate-700 border-slate-200">
                                                        {skill.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {selectedProviderRequest.educations && selectedProviderRequest.educations.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Education</h3>
                                        {selectedProviderRequest.educations.map((edu: any) => (
                                            <div key={edu.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-slate-800">{edu.degree} in {edu.fieldOfStudy}</h4>
                                                        <p className="text-slate-600">{edu.school}</p>
                                                        <p className="text-sm text-slate-500 mt-1">
                                                            {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}
                                                        </p>
                                                        {edu.description && <p className="text-sm text-slate-600 mt-2">{edu.description}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Work History */}
                                {selectedProviderRequest.workHistories && selectedProviderRequest.workHistories.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Work Experience</h3>
                                        {selectedProviderRequest.workHistories.map((work: any) => (
                                            <div key={work.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-slate-800">{work.title}</h4>
                                                        <p className="text-slate-600">{work.company}</p>
                                                        <p className="text-sm text-slate-500 mt-1">
                                                            <MapPin className="inline h-3 w-3 mr-1" />
                                                            {work.location}, {work.country}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            {new Date(work.startDate).toLocaleDateString()} - {new Date(work.endDate).toLocaleDateString()}
                                                        </p>
                                                        {work.description && <p className="text-sm text-slate-600 mt-2">{work.description}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Languages */}
                                {selectedProviderRequest.languages && selectedProviderRequest.languages.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Languages</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedProviderRequest.languages.map((lang: any) => (
                                                <div key={lang.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                                    <p className="font-medium text-slate-800">{lang.language}</p>
                                                    <Badge variant="outline" className="mt-1 text-xs bg-white">
                                                        {lang.proficiency}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-slate-200">
                                    <Button
                                        className="flex-1 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
                                        onClick={() => {
                                            handleApproveProvider(selectedProviderRequest.id);
                                            setSelectedProviderRequest(null);
                                        }}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" /> Approve Application
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 rounded-2xl border-rose-300 text-rose-600 hover:bg-rose-50"
                                        onClick={() => {
                                            handleRejectProvider(selectedProviderRequest.id);
                                            setSelectedProviderRequest(null);
                                        }}
                                    >
                                        <Ban className="mr-2 h-4 w-4" /> Reject Application
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </section>
        </div>
    );
}
