"use client";

import Button from "@/shared/components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";

export function SecuritySettings() {
    return (
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
    );
}
