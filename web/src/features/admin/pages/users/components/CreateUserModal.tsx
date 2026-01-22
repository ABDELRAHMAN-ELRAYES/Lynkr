"use client";

import { UserPlus, X } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/shared/lib/utils";

// Available user roles from backend
const USER_ROLES = [
    { value: "CLIENT", label: "Client" },
    { value: "PROVIDER", label: "Provider" },
    { value: "PENDING_PROVIDER", label: "Pending Provider" },
    { value: "ADMIN", label: "Admin" },
    { value: "SUPER_ADMIN", label: "Super Admin" },
] as const;

interface CreateUserModalProps {
    createUserData: any;
    setCreateUserData: (data: any) => void;
    handleCreateUser: () => void;
    createUserLoading: boolean;
    onClose: () => void;
}

export function CreateUserModal({
    createUserData,
    setCreateUserData,
    handleCreateUser,
    createUserLoading,
    onClose
}: CreateUserModalProps) {
    return (
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
                        onClick={onClose}
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
                        <Button variant="outline" className="rounded-2xl" onClick={onClose}>Cancel</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
