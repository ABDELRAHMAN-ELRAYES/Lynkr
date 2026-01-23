"use client";

import { useState } from "react";
import { Search, Activity } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/shared/components/ui/card";
import { useAdminContext } from "../AdminLayout";
import { activeProjects } from "@/features/admin/data/mockData";
import { ProjectsHeader } from "./components/ProjectsHeader";
import { ProjectsStats } from "./components/ProjectsStats";
import { ProjectsTable } from "./components/ProjectsTable";
import { StatusTag } from "@/shared/components/common/tags";


type ProjectsSubTab = "all" | "active" | "completed" | "on_hold" | "cancelled";

export default function ProjectsPage() {
    const { handleExportData } = useAdminContext();
    const [projectsSubTab, setProjectsSubTab] = useState<ProjectsSubTab>("all");
    const [projectSearch, setProjectSearch] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    const filteredProjects = activeProjects.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
            project.client.toLowerCase().includes(projectSearch.toLowerCase());
        const matchesFilter = projectsSubTab === "all" || project.status === projectsSubTab;
        return matchesSearch && matchesFilter;
    });

    const completedProjects = activeProjects.filter(p => p.status === "completed" || p.progress === 100);

    return (
        <div className="space-y-8">
            <ProjectsHeader
                activeTab={activeTab}
                handleExportData={handleExportData}
            />

            <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <TabsList className="bg-white/50 p-1 rounded-2xl border border-slate-200/80">
                        <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                        <TabsTrigger value="active" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Active Projects</TabsTrigger>
                        <TabsTrigger value="completed" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Completed</TabsTrigger>
                    </TabsList>

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
                </div>

                <TabsContent value="overview" className="space-y-8 mt-6">
                    <ProjectsStats activeCount={activeProjects.length} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest updates from projects</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <Activity className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">
                                                    Project "E-commerce Redesign" updated
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    2 hours ago by Sarah Wilson
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle>Upcoming Deadlines</CardTitle>
                                <CardDescription>Projects due this week</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {activeProjects.slice(0, 3).map((project) => (
                                        <div key={project.id} className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-rose-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{project.name}</p>
                                                    <p className="text-xs text-slate-500">{project.deadline}</p>
                                                </div>
                                            </div>
                                            <StatusTag colorScheme="warning">Due Soon</StatusTag>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="active" className="mt-6">
                    <ProjectsTable projects={filteredProjects} />
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                    <ProjectsTable projects={completedProjects} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
