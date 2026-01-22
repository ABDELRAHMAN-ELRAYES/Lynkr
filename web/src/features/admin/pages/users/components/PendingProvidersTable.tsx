"use client";

import {
    Ban,
    CheckCircle,
    Eye,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import Button from "@/shared/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { Pagination } from "@/shared/components/ui/pagination";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";

interface PendingProvidersTableProps {
    pendingProviders: any[]; // Replace 'any' with specific type if available, e.g. ProviderRequest
    pendingProvidersLoading: boolean;
    handleApproveProvider: (id: string) => void;
    handleRejectProvider: (id: string) => void;
    setSelectedProviderRequest: (request: any) => void;
}

export function PendingProvidersTable({
    pendingProviders,
    pendingProvidersLoading,
    handleApproveProvider,
    handleRejectProvider,
    setSelectedProviderRequest
}: PendingProvidersTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(pendingProviders.length / itemsPerPage);
    const paginatedProviders = pendingProviders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
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
                            {paginatedProviders.map((request, index) => (
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
            {!pendingProvidersLoading && pendingProviders.length > 0 && totalPages > 1 && (
                <CardFooter className="flex items-center justify-between p-4 border-t border-slate-200/80">
                    <div className="text-sm text-slate-500">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pendingProviders.length)} of {pendingProviders.length} entries
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
