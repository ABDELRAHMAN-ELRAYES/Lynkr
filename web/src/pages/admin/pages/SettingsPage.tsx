"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <section>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 p-8 text-white shadow-lg"
                >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                            <Badge className="bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/20">
                                Platform Settings
                            </Badge>
                            <h2 className="text-3xl font-bold">System Configuration</h2>
                            <p className="max-w-[600px] text-white/80">
                                Configure platform settings, manage system preferences, and
                                customize the user experience.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            <Card className="rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Basic platform configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="platform-name">Platform Name</Label>
                            <Input id="platform-name" defaultValue="ProjectHub" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="platform-url">Platform URL</Label>
                            <Input id="platform-url" defaultValue="https://projecthub.example.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="platform-description">Platform Description</Label>
                        <Textarea
                            id="platform-description"
                            defaultValue="A professional platform connecting clients with service providers"
                            rows={3}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="maintenance-mode" />
                        <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="registration" defaultChecked />
                        <Label htmlFor="registration">Allow New User Registration</Label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="bg-slate-800 text-white hover:bg-slate-700">
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>

            <Card className="rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Configure email and push notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Email Notifications</p>
                            <p className="text-xs text-slate-500">Receive email alerts for important events</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Push Notifications</p>
                            <p className="text-xs text-slate-500">Receive browser push notifications</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-700">New User Alerts</p>
                            <p className="text-xs text-slate-500">Get notified when new users register</p>
                        </div>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Order Alerts</p>
                            <p className="text-xs text-slate-500">Get notified for new orders</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="bg-slate-800 text-white hover:bg-slate-700">
                        Save Notifications
                    </Button>
                </CardFooter>
            </Card>

            <Card className="rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage security and access controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Two-Factor Authentication</p>
                            <p className="text-xs text-slate-500">Require 2FA for admin accounts</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Session Timeout</p>
                            <p className="text-xs text-slate-500">Auto-logout after inactivity</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-700">Login Alerts</p>
                            <p className="text-xs text-slate-500">Email alerts for new login locations</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="bg-slate-800 text-white hover:bg-slate-700">
                        Save Security Settings
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
