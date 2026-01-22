"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/shared/components/ui/use-toast";
import { userService } from "@/shared/services";
import { UserResponse, UserStatistics } from "@/shared/types/user";
import { useAdminContext } from "../AdminLayout";
import { UsersHeader } from "./components/UsersHeader";
import { UsersStats } from "./components/UsersStats";
import { UsersFilters, UsersSubTab } from "./components/UsersFilters";
import { UsersTable } from "./components/UsersTable";
import { PendingProvidersTable } from "./components/PendingProvidersTable";
import { UserDetailModal } from "./components/UserDetailModal";
import { CreateUserModal } from "./components/CreateUserModal";

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

    // Local State
    const [userFilter, setUserFilter] = useState("all");
    const [userSearch, setUserSearch] = useState("");
    const [usersSubTab, setUsersSubTab] = useState<UsersSubTab>("all");
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [editUserData, setEditUserData] = useState<any>(null);
    const [selectedProviderRequest, setSelectedProviderRequest] = useState<any>(null);

    // Statistics state
    const [statistics, setStatistics] = useState<UserStatistics | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);

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

    // Fetch statistics
    const fetchStatistics = async () => {
        setStatsLoading(true);
        try {
            const stats = await userService.getStatistics();
            setStatistics(stats);
        } catch (error) {
            console.error("Failed to fetch statistics:", error);
        } finally {
            setStatsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchStatistics();
    }, []);

    useEffect(() => {
        if (usersSubTab === "provider-requests") {
            fetchPendingProviders();
        }
    }, [usersSubTab]);

    // Handlers
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
            fetchStatistics();
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
            fetchStatistics();
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
            fetchStatistics();
        } catch (error) {
            toast({ title: "Error", description: "Failed to suspend user.", variant: "destructive" });
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await userService.deleteUser(userId);
            toast({ title: "User deleted", description: "User account has been deleted." });
            fetchUsers();
            fetchStatistics();
            if (selectedUser?.id == userId) {
                setSelectedUser(null);
                setIsEditingUser(false);
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" });
        }
    };

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
            fetchStatistics();
        } catch (error: any) {
            toast({ title: "Error", description: error?.response?.data?.message || "Failed to create user.", variant: "destructive" });
        } finally {
            setCreateUserLoading(false);
        }
    };

    // Filter Logic
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
            <UsersHeader
                usersSubTab={usersSubTab}
                handleExportData={handleExportData}
                setIsCreatingUser={setIsCreatingUser}
            />

            <UsersStats
                statistics={statistics}
                statsLoading={statsLoading}
                totalUsersCount={users.length}
            />

            <div className="space-y-4">
                <UsersFilters
                    usersSubTab={usersSubTab}
                    setUsersSubTab={setUsersSubTab}
                    userFilter={userFilter}
                    setUserFilter={setUserFilter}
                    userSearch={userSearch}
                    setUserSearch={setUserSearch}
                />

                {usersSubTab === "provider-requests" ? (
                    <PendingProvidersTable
                        pendingProviders={pendingProviders}
                        pendingProvidersLoading={pendingProvidersLoading}
                        handleApproveProvider={handleApproveProvider}
                        handleRejectProvider={handleRejectProvider}
                        setSelectedProviderRequest={setSelectedProviderRequest}
                    />
                ) : (
                    <UsersTable
                        filteredUsers={filteredUsers}
                        handleEditUser={handleEditUser}
                        handleApproveUser={handleApproveUser}
                        handleSuspendUser={handleSuspendUser}
                        handleDeleteUser={handleDeleteUser}
                    />
                )}
            </div>

            {selectedUser && (
                <UserDetailModal
                    selectedUser={selectedUser}
                    isEditingUser={isEditingUser}
                    setIsEditingUser={setIsEditingUser}
                    editUserData={editUserData}
                    setEditUserData={setEditUserData}
                    handleSaveUser={handleSaveUser}
                    onClose={() => { setSelectedUser(null); setIsEditingUser(false); }}
                    onEditClick={handleEditUser}
                />
            )}

            {isCreatingUser && (
                <CreateUserModal
                    createUserData={createUserData}
                    setCreateUserData={setCreateUserData}
                    handleCreateUser={handleCreateUser}
                    createUserLoading={createUserLoading}
                    onClose={() => {
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
                />
            )}
        </div>
    );
}
