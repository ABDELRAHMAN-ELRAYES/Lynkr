"use client";

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
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";

export function GeneralSettings() {
    return (
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
    );
}
