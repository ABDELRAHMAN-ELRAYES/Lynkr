"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { settingsService, PlatformSettings } from "@/shared/services/admin/settings.service";
import { toast } from "sonner";

export default function SettingsPage() {
    const [settings, setSettings] = useState<PlatformSettings | null>(null);
    const [formData, setFormData] = useState({
        platformName: "Lynkr",
        platformCommission: 15,
        minWithdrawal: 10,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch settings on mount
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const response = await settingsService.getSettings();
            if (response.success && response.data) {
                setSettings(response.data);
                setFormData({
                    platformName: response.data.platformName,
                    platformCommission: Number(response.data.platformCommission),
                    minWithdrawal: Number(response.data.minWithdrawal),
                });
            } else {
                toast.error(response.message || "Failed to load settings");
            }
        } catch (error) {
            toast.error("Failed to load settings");
            console.error("Failed to fetch settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const response = await settingsService.updateSettings(formData);
            if (response.success && response.data) {
                setSettings(response.data);
                toast.success(response.message || "Settings updated successfully");
            } else {
                toast.error(response.message || "Failed to update settings");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update settings");
            console.error("Failed to update settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg text-slate-600">Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden rounded-3xl bg-[#7682e8] p-8 text-white shadow-lg"
                >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                            <Badge className="bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/20">
                                Platform Settings
                            </Badge>
                            <h2 className="text-3xl font-bold">System Configuration</h2>
                            <p className="max-w-[600px] text-white/80">
                                Configure platform settings, manage commission rates, and
                                customize the user experience.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            <Card className="rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>Configure core platform settings and features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Platform Name */}
                    <div className="space-y-2">
                        <Label htmlFor="platform-name">Platform Name</Label>
                        <Input
                            id="platform-name"
                            value={formData.platformName}
                            onChange={(e) =>
                                setFormData({ ...formData, platformName: e.target.value })
                            }
                            placeholder="Enter platform name"
                        />
                    </div>

                    {/* Commission and Withdrawal Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="commission">Platform Commission Rate (%)</Label>
                            <div className="relative">
                                <Input
                                    id="commission"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={formData.platformCommission}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            platformCommission: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="15"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                    %
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">
                                Percentage taken from each completed project
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="withdrawal">Minimum Withdrawal Amount ($)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                    $
                                </span>
                                <Input
                                    id="withdrawal"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.minWithdrawal}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            minWithdrawal: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    className="pl-8"
                                    placeholder="10"
                                />
                            </div>
                            <p className="text-xs text-slate-500">
                                Minimum amount providers can withdraw
                            </p>
                        </div>
                    </div>


                </CardContent>
                <CardFooter className="flex justify-between">
                    <p className="text-xs text-slate-500">
                        Last updated: {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleString() : "N/A"}
                    </p>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-slate-800 text-white hover:bg-slate-700"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
