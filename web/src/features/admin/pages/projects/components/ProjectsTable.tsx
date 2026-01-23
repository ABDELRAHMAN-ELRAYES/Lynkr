"use client";

import {
    Calendar,
    Edit,
    Eye,
    MessageSquare,
    MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { ProjectStatusTag, StatusTag } from "@/shared/components/common/tags";
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
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Progress } from "@/shared/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { ActiveProject } from "@/shared/types/project";

interface ProjectsTableProps {
    projects: ActiveProject[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(projects.length / itemsPerPage);
    const paginatedProjects = projects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-slate-200">
                            <TableHead className="p-4 text-slate-600">Project</TableHead>
                            <TableHead className="p-4 text-slate-600">Client</TableHead>
                            <TableHead className="p-4 text-slate-600">Status</TableHead>
                            <TableHead className="p-4 text-slate-600">Progress</TableHead>
                            <TableHead className="p-4 text-slate-600">Deadline</TableHead>
                            <TableHead className="p-4 text-slate-600">Priority</TableHead>
                            <TableHead className="p-4 text-right text-slate-600">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedProjects.map((project, index) => (
                            <TableRow key={project.id} className={cn("border-b-slate-200/80", index % 2 !== 0 && "bg-slate-50/50")}>
                                <TableCell className="p-4">
                                    <div>
                                        <div className="font-semibold text-slate-800">{project.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{project.client[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-slate-700">{project.client}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="p-4">
                                    <ProjectStatusTag
                                        status={
                                            (project.status as string) === "active" ? "IN_PROGRESS" :
                                                (project.status as string) === "completed" ? "COMPLETED" :
                                                    (project.status as string) === "on_hold" ? "PENDING_PAYMENT" :
                                                        (project.status as string) === "cancelled" ? "CANCELLED" : "IN_PROGRESS"
                                        }
                                    />
                                </TableCell>
                                <TableCell className="p-4 min-w-[150px]">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>{project.progress}%</span>
                                        </div>
                                        <Progress value={project.progress} className="h-2" />
                                    </div>
                                </TableCell>
                                <TableCell className="p-4">
                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                        <Calendar className="h-4 w-4" />
                                        {project.deadline}
                                    </div>
                                </TableCell>
                                <TableCell className="p-4">
                                    <StatusTag
                                        colorScheme={
                                            project.priority.toLowerCase() === 'high' ? 'error' :
                                                project.priority.toLowerCase() === 'medium' ? 'warning' : 'success'
                                        }
                                    >
                                        {project.priority}
                                    </StatusTag>
                                </TableCell>
                                <TableCell className="p-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="rounded-xl h-9 w-9 data-[state=open]:bg-slate-100">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Project</DropdownMenuItem>
                                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Details</DropdownMenuItem>
                                            <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" /> Message Client</DropdownMenuItem>
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
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, projects.length)} of {projects.length} entries
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
