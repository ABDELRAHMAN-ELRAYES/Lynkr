"use client";

import {
    Calendar,
    Edit,
    Mail,
    MapPin,
    X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { UserRoleTag, UserStatusTag } from "@/shared/components/common/tags";
import Button from "@/shared/components/ui/Button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { UserResponse } from "@/shared/types/user";
// import { getStatusColor, getRoleColor } from "@/features/admin/utils/adminUtils";

interface UserDetailModalProps {
    selectedUser: UserResponse | null;
    isEditingUser: boolean;
    setIsEditingUser: (value: boolean) => void;
    editUserData: any;
    setEditUserData: (value: any) => void;
    handleSaveUser: () => void;
    onClose: () => void;
    onEditClick: (user: UserResponse) => void;
}

export function UserDetailModal({
    selectedUser,
    isEditingUser,
    setIsEditingUser,
    editUserData,
    setEditUserData,
    handleSaveUser,
    onClose,
    onEditClick
}: UserDetailModalProps) {
    if (!selectedUser) return null;

    return (
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
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
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
                                    <UserRoleTag role={selectedUser.role as any} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-500">Status</label>
                                    <UserStatusTag active={selectedUser.is_active} />
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
                                <Button onClick={() => onEditClick(selectedUser)} className="rounded-2xl bg-slate-800 text-white hover:bg-slate-700">
                                    <Edit className="mr-2 h-4 w-4" /> Edit User
                                </Button>
                                <Button variant="outline" className="rounded-2xl"><Mail className="mr-2 h-4 w-4" /> Send Message</Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
