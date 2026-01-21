import { ReactNode } from "react";

export interface PlatformStat {
    title: string;
    value: string;
    change: string;
    icon: ReactNode;
    trend: "up" | "down";
    bgColor: string;
}

export interface RecentActivity {
    id: number;
    type: string;
    user: string;
    action: string;
    time: string;
    status: string;
    icon: ReactNode;
    avatar?: string;
}

export interface Notification {
    id: number;
    icon: ReactNode;
    text: string;
    time: string;
}
