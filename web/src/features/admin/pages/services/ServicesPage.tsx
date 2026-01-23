"use client";

import { useEffect, useState } from "react";
import { Plus, Grid, List, Search, Loader2, Trash2, Eye } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { serviceService, Service } from "@/shared/services";
import Button from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { ActiveStatusTag, StatusTag } from "@/shared/components/common/tags";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";

export default function ServicesPage() {
    const { toast } = useToast();

    // State
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"card" | "list">("card");
    const [searchQuery, setSearchQuery] = useState("");
    const [includeInactive, setIncludeInactive] = useState(false);

    // Modal states
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [serviceForm, setServiceForm] = useState({ name: "", description: "" });
    const [isSaving, setIsSaving] = useState(false);

    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [skillParentService, setSkillParentService] = useState<Service | null>(null);
    const [skillName, setSkillName] = useState("");
    const [isSavingSkill, setIsSavingSkill] = useState(false);

    // View all skills modal
    const [isViewSkillsModalOpen, setIsViewSkillsModalOpen] = useState(false);
    const [viewingSkillsService, setViewingSkillsService] = useState<Service | null>(null);
    const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);

    // Fetch services
    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const data = await serviceService.getAllServices(includeInactive);
            setServices(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch services.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [includeInactive]);

    // Filtered services
    const filteredServices = services.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const openCreateServiceModal = () => {
        setEditingService(null);
        setServiceForm({ name: "", description: "" });
        setIsServiceModalOpen(true);
    };

    const openEditServiceModal = (service: Service) => {
        setEditingService(service);
        setServiceForm({ name: service.name, description: service.description || "" });
        setIsServiceModalOpen(true);
    };

    const handleSaveService = async () => {
        if (!serviceForm.name.trim()) {
            toast({ title: "Error", description: "Service name is required.", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        try {
            if (editingService) {
                await serviceService.updateService(editingService.id, serviceForm);
                toast({ title: "Success", description: "Service updated successfully." });
            } else {
                await serviceService.createService(serviceForm);
                toast({ title: "Success", description: "Service created successfully." });
            }
            setIsServiceModalOpen(false);
            fetchServices();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save service.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleServiceStatus = async (service: Service) => {
        try {
            await serviceService.updateService(service.id, { isActive: !service.isActive });
            toast({
                title: service.isActive ? "Service Deactivated" : "Service Activated",
                description: `${service.name} has been ${service.isActive ? "deactivated" : "activated"}.`,
            });
            fetchServices();
        } catch (error) {
            toast({ title: "Error", description: "Failed to update service status.", variant: "destructive" });
        }
    };

    const handleDeleteServicePermanently = async (service: Service) => {
        const confirmMessage = `⚠️ PERMANENT DELETE\n\nAre you sure you want to permanently delete "${service.name}"?\n\nThis will also delete all ${service.skills?.length || 0} associated skills.\n\nThis action cannot be undone!`;
        if (!confirm(confirmMessage)) return;

        try {
            await serviceService.deleteService(service.id);
            toast({ title: "Deleted", description: `"${service.name}" has been permanently deleted.` });
            fetchServices();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete service.", variant: "destructive" });
        }
    };

    const openAddSkillModal = (service: Service) => {
        setSkillParentService(service);
        setSkillName("");
        setIsSkillModalOpen(true);
    };

    const handleAddSkill = async () => {
        if (!skillName.trim() || !skillParentService) return;
        setIsSavingSkill(true);
        try {
            await serviceService.createSkill(skillParentService.id, { name: skillName });
            toast({ title: "Success", description: "Skill added successfully." });
            setIsSkillModalOpen(false);
            fetchServices();
        } catch (error) {
            toast({ title: "Error", description: "Failed to add skill.", variant: "destructive" });
        } finally {
            setIsSavingSkill(false);
        }
    };

    const openViewSkillsModal = (service: Service) => {
        setViewingSkillsService(service);
        setIsViewSkillsModalOpen(true);
    };

    const handleDeleteSkill = async (serviceId: string, skillId: string, skillName: string) => {
        if (!confirm(`Are you sure you want to delete skill "${skillName}"?`)) return;
        setDeletingSkillId(skillId);
        try {
            await serviceService.deleteSkill(serviceId, skillId);
            toast({ title: "Success", description: "Skill deleted successfully." });
            // Update the viewing service's skills locally
            if (viewingSkillsService) {
                const updatedSkills = viewingSkillsService.skills?.filter(s => s.id !== skillId) || [];
                setViewingSkillsService({ ...viewingSkillsService, skills: updatedSkills });
            }
            fetchServices();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete skill.", variant: "destructive" });
        } finally {
            setDeletingSkillId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Services & Skills</h1>
                    <p className="text-sm text-slate-500">Manage platform service categories and their skills</p>
                </div>
                <Button className="rounded-2xl bg-[#7682e8] text-white hover:bg-[#7682e8]/80" onClick={openCreateServiceModal}>
                    <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 rounded-2xl bg-white border-slate-300"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            id="include-inactive"
                            checked={includeInactive}
                            onCheckedChange={setIncludeInactive}
                        />
                        <Label htmlFor="include-inactive" className="text-sm text-slate-600">
                            Show inactive
                        </Label>
                    </div>
                </div>
                <div className="flex items-center gap-2 border border-gray-100 rounded-2xl p-1 bg-slate-100">
                    <Button
                        variant={viewMode === "card" ? "default" : "ghost"}
                        size="sm"
                        className={cn("rounded-xl", viewMode === "card" && "bg-white shadow-sm")}
                        onClick={() => setViewMode("card")}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        className={cn("rounded-xl", viewMode === "list" && "bg-white shadow-sm")}
                        onClick={() => setViewMode("list")}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#7682e8]" />
                </div>
            ) : filteredServices.length === 0 ? (
                <Card className="rounded-3xl border-slate-200">
                    <CardContent className="py-12 text-center">
                        <p className="text-slate-500">No services found. Create your first service to get started.</p>
                    </CardContent>
                </Card>
            ) : viewMode === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <Card
                            key={service.id}
                            className={cn(
                                "rounded-3xl border-slate-200 hover:shadow-md transition-shadow",
                                !service.isActive && "opacity-60"
                            )}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg text-slate-800">{service.name}</CardTitle>
                                    <ActiveStatusTag active={service.isActive} />
                                </div>
                                {service.description && (
                                    <CardDescription className="line-clamp-2">{service.description}</CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 mb-2">
                                        Skills ({service.skills?.length || 0}):
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {service.skills?.slice(0, 5).map((skill) => (
                                            <StatusTag key={skill.id} colorScheme="primary" className="text-xs">
                                                {skill.name}
                                            </StatusTag>
                                        ))}
                                        {(service.skills?.length || 0) > 5 && (
                                            <StatusTag
                                                colorScheme="neutral"
                                                className="text-xs cursor-pointer hover:bg-slate-100"
                                                onClick={() => openViewSkillsModal(service)}
                                            >
                                                +{(service.skills?.length || 0) - 5} more
                                            </StatusTag>
                                        )}
                                        {(service.skills?.length || 0) > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700"
                                                onClick={() => openViewSkillsModal(service)}
                                            >
                                                <Eye className="h-3 w-3 mr-1" /> View All
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl flex-1"
                                        onClick={() => openEditServiceModal(service)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl flex-1 bg-[#7682e8] text-white"
                                        onClick={() => openAddSkillModal(service)}
                                    >
                                        Add Skill
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={cn(
                                            "rounded-xl",
                                            service.isActive ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                                        )}
                                        onClick={() => handleToggleServiceStatus(service)}
                                    >
                                        {service.isActive ? "Deactivate" : "Activate"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl text-rose-600 hover:bg-rose-50"
                                        onClick={() => handleDeleteServicePermanently(service)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="rounded-3xl border-slate-200">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="p-4">Service</TableHead>
                                <TableHead className="p-4">Description</TableHead>
                                <TableHead className="p-4">Skills</TableHead>
                                <TableHead className="p-4">Status</TableHead>
                                <TableHead className="p-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredServices.map((service) => (
                                <TableRow key={service.id} className={cn(!service.isActive && "opacity-60")}>
                                    <TableCell className="p-4 font-medium">{service.name}</TableCell>
                                    <TableCell className="p-4 text-sm text-slate-600 max-w-xs truncate">
                                        {service.description || "-"}
                                    </TableCell>
                                    <TableCell className="p-4">
                                        <StatusTag
                                            colorScheme="neutral"
                                            className="cursor-pointer hover:bg-slate-200"
                                            onClick={() => openViewSkillsModal(service)}
                                        >
                                            {service.skills?.length || 0} skills
                                        </StatusTag>
                                    </TableCell>
                                    <TableCell className="p-4">
                                        <ActiveStatusTag active={service.isActive} />
                                    </TableCell>
                                    <TableCell className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => openEditServiceModal(service)}>
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm" className="rounded-xl bg-[#7682e8] text-white" onClick={() => openAddSkillModal(service)}>
                                                Add Skill
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={cn(
                                                    "rounded-xl",
                                                    service.isActive ? "text-amber-600" : "text-emerald-600"
                                                )}
                                                onClick={() => handleToggleServiceStatus(service)}
                                            >
                                                {service.isActive ? "Deactivate" : "Activate"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl text-rose-600 hover:bg-rose-50"
                                                onClick={() => handleDeleteServicePermanently(service)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}

            {/* Create/Edit Service Modal */}
            <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingService ? "Edit Service" : "Create New Service"}</DialogTitle>
                        <DialogDescription>
                            {editingService ? "Update the service details below." : "Add a new service category to the platform."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="service-name">Service Name *</Label>
                            <Input
                                id="service-name"
                                value={serviceForm.name}
                                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                placeholder="e.g. Web Development"
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="service-description">Description</Label>
                            <Textarea
                                id="service-description"
                                value={serviceForm.description}
                                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                                placeholder="Describe what this service category covers..."
                                className="rounded-xl"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="rounded-xl" onClick={() => setIsServiceModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="rounded-xl bg-[#7682e8] text-white hover:bg-[#7682e8]/80"
                            onClick={handleSaveService}
                            disabled={isSaving}
                        >
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingService ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Skill Modal */}
            <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Skill</DialogTitle>
                        <DialogDescription>
                            Add a new skill to {skillParentService?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="skill-name">Skill Name *</Label>
                            <Input
                                id="skill-name"
                                value={skillName}
                                onChange={(e) => setSkillName(e.target.value)}
                                placeholder="e.g. React, Node.js"
                                className="rounded-xl"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="rounded-xl" onClick={() => setIsSkillModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="rounded-xl bg-[#7682e8] text-white hover:bg-[#7682e8]/80"
                            onClick={handleAddSkill}
                            disabled={isSavingSkill || !skillName.trim()}
                        >
                            {isSavingSkill && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Skill
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View All Skills Modal */}
            <Dialog open={isViewSkillsModalOpen} onOpenChange={setIsViewSkillsModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Skills for {viewingSkillsService?.name}</DialogTitle>
                        <DialogDescription>
                            Manage all skills associated with this service. Click the trash icon to delete a skill.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-80 overflow-y-auto space-y-2">
                        {viewingSkillsService?.skills?.length === 0 ? (
                            <p className="text-center text-slate-500 py-4">No skills found for this service.</p>
                        ) : (
                            viewingSkillsService?.skills?.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100"
                                >
                                    <div className="flex items-center gap-2">
                                        <StatusTag colorScheme="primary">
                                            {skill.name}
                                        </StatusTag>
                                        {!skill.isActive && (
                                            <ActiveStatusTag active={false} size="sm" />
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                        onClick={() => handleDeleteSkill(viewingSkillsService.id, skill.id, skill.name)}
                                        disabled={deletingSkillId === skill.id}
                                    >
                                        {deletingSkillId === skill.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            className="rounded-xl flex-1"
                            onClick={() => {
                                if (viewingSkillsService) {
                                    setIsViewSkillsModalOpen(false);
                                    openAddSkillModal(viewingSkillsService);
                                }
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add New Skill
                        </Button>
                        <Button
                            className="rounded-xl bg-[#7682e8] text-white hover:bg-[#7682e8]/80 flex-1"
                            onClick={() => setIsViewSkillsModalOpen(false)}
                        >
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
