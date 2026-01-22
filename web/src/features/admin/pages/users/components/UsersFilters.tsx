"use client";

import { Filter, Search } from "lucide-react";
import Button from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

export type UsersSubTab = "all" | "active" | "pending" | "suspended" | "provider-requests";

interface UsersFiltersProps {
    usersSubTab: UsersSubTab;
    setUsersSubTab: (value: UsersSubTab) => void;
    userFilter: string;
    setUserFilter: (value: string) => void;
    userSearch: string;
    setUserSearch: (value: string) => void;
}

export function UsersFilters({
    usersSubTab,
    setUsersSubTab,
    userFilter,
    setUserFilter,
    userSearch,
    setUserSearch,
}: UsersFiltersProps) {
    return (
        <section className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-3">
                    <Select
                        value={usersSubTab !== "all" ? usersSubTab : userFilter}
                        onValueChange={(v) => {
                            if (["active", "pending", "suspended", "provider-requests", "all"].includes(v)) {
                                setUsersSubTab(v as UsersSubTab);
                                setUserFilter(v);
                            }
                        }}
                    >
                        <SelectTrigger className="w-[180px] rounded-2xl bg-white border-slate-300">
                            <SelectValue placeholder="Filter users" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="provider-requests">Provider Requests</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="rounded-2xl bg-white border-slate-300 text-slate-700 hover:bg-slate-100">
                        <Filter className="mr-2 h-4 w-4" />
                        More Filters
                    </Button>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search users..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="w-full rounded-2xl pl-9 bg-white border-slate-300"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
