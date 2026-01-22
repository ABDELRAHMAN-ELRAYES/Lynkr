"use client";

import {
    Ban,
    CheckCircle,
    Edit,
    Eye,
    Mail,
    MoreHorizontal,
    Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import Button from "@/shared/components/ui/Button";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/shared/components/ui/card";
import { Pagination } from "@/shared/components/ui/pagination";
import { useState } from "react";
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
import { cn } from "@/shared/lib/utils";
import { UserResponse } from "@/shared/types/user";
import { getStatusColor, getRoleColor } from "@/features/admin/utils/adminUtils";

interface UsersTableProps {
    filteredUsers: UserResponse[];
    handleEditUser: (user: UserResponse) => void;
    handleApproveUser: (user: UserResponse) => void;
    handleSuspendUser: (user: UserResponse) => void;
    handleDeleteUser: (userId: string) => void;
}

export function UsersTable({
    filteredUsers,
    handleEditUser,
    handleApproveUser,
    handleSuspendUser,
    handleDeleteUser
}: UsersTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
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
                        {paginatedUsers.map((user, index) => (
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
                                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                                <Eye className="mr-2 h-4 w-4" /> View/Edit
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
            {totalPages > 1 && (
                <CardFooter className="flex items-center justify-between p-4 border-t border-slate-200/80">
                    <div className="text-sm text-slate-500">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </CardFooter>
            )}
        </Card>
    );
}
