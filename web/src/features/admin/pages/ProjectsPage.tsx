"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    Calendar,
    Download,
    Edit,
    Eye,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
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
import { Progress } from "@/shared/components/ui/progress";
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
import { cn } from "@/shared/lib/utils";
import { useAdminContext } from "../AdminLayout";
import { activeProjects } from "./mockData";
import { getPriorityColor } from "./utils.tsx";

type ProjectsSubTab = "all" | "active" | "completed" | "on_hold" | "cancelled";

export default function ProjectsPage() {
    const { handleExportData } = useAdminContext();

    const [projectsSubTab, setProjectsSubTab] = useState<ProjectsSubTab>("all");
    const [projectSearch, setProjectSearch] = useState("");

    const filteredProjects = activeProjects.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
            project.client.toLowerCase().includes(projectSearch.toLowerCase());
        const matchesFilter =
            projectsSubTab === "all" || project.status === projectsSubTab;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "completed": return "bg-blue-50 text-blue-700 border-blue-200";
            case "on_hold": return "bg-amber-50 text-amber-700 border-amber-200";
            case "cancelled": return "bg-rose-50 text-rose-700 border-rose-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <div className="space-y-8">
            <section>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-purple-600 p-8 text-white shadow-lg"
                >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                            <Badge className="bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/20">
                                Project Management
                            </Badge>
                            <h2 className="text-3xl font-bold">
                                {projectsSubTab === "active" ? "Active Projects" :
                                    projectsSubTab === "completed" ? "Completed Projects" :
                                        projectsSubTab === "on_hold" ? "On Hold Projects" :
                                            projectsSubTab === "cancelled" ? "Cancelled Projects" : "All Projects"}
                            </h2>
                            <p className="max-w-[600px] text-white/80">
                                Monitor project progress, manage deadlines, and track deliverables.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button className="rounded-2xl bg-white text-violet-700 hover:bg-white/90 shadow">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Project
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-2xl bg-transparent border-white/50 text-white hover:bg-white/10"
                                    onClick={() => handleExportData("projects")}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Projects
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <Select value={projectsSubTab} onValueChange={(v) => setProjectsSubTab(v as ProjectsSubTab)}>
                            <SelectTrigger className="w-[180px] rounded-2xl bg-white border-slate-300">
                                <SelectValue placeholder="Filter projects" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Projects</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="on_hold">On Hold</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" className="rounded-2xl bg-white border-slate-300 text-slate-700 hover:bg-slate-100">
                            <Filter className="mr-2 h-4 w-4" />
                            More Filters
                        </Button>
                    </div>

                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search projects..."
                            value={projectSearch}
                            onChange={(e) => setProjectSearch(e.target.value)}
                            className="w-full rounded-2xl pl-9 bg-white border-slate-300"
                        />
                    </div>
                </div>

                <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b-slate-200">
                                    <TableHead className="p-4 text-slate-600">Project</TableHead>
                                    <TableHead className="p-4 text-slate-600">Client</TableHead>
                                    <TableHead className="p-4 text-slate-600">Status</TableHead>
                                    <TableHead className="p-4 text-slate-600">Progress</TableHead>
                                    <TableHead className="p-4 text-slate-600">Budget</TableHead>
                                    <TableHead className="p-4 text-slate-600">Deadline</TableHead>
                                    <TableHead className="p-4 text-slate-600">Priority</TableHead>
                                    <TableHead className="p-4 text-right text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProjects.map((project, index) => (
                                    <TableRow key={project.id} className={cn("border-b-slate-200/80", index % 2 !== 0 && "bg-slate-50/50")}>
                                        <TableCell className="p-4">
                                            <div className="font-semibold text-slate-800">{project.name}</div>
                                            <div className="text-sm text-slate-500">ID: {project.id}</div>
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
                                            <Badge variant="outline" className={cn("rounded-xl font-medium", getStatusColor(project.status))}>
                                                {project.status.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="w-24">
                                                <div className="flex items-center justify-between text-xs mb-1">
                                                    <span className="font-medium text-slate-700">{project.progress}%</span>
                                                </div>
                                                <Progress value={project.progress} className="h-2 bg-slate-200" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="text-sm font-medium text-slate-800">${project.budget.toLocaleString()}</div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <div className="flex items-center gap-1 text-sm text-slate-600">
                                                <Calendar className="h-4 w-4" />
                                                {project.deadline}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-4">
                                            <Badge className={cn("rounded-xl font-medium", getPriorityColor(project.priority))}>
                                                {project.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="rounded-xl h-9 w-9 data-[state=open]:bg-slate-100">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                                                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Project</DropdownMenuItem>
                                                    <DropdownMenuItem><ArrowUpRight className="mr-2 h-4 w-4" /> Open Dashboard</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Project
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
            </section>
        </div>
    );
}
