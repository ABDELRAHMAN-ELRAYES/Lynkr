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

export function NotificationSettings() {
    return (
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
    );
}
