// Color utility functions for Admin Dashboard

export const getStatusColor = (status: string): string => {
    switch (status) {
        case "active":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "pending":
            return "bg-amber-50 text-amber-800 border-amber-200";
        case "suspended":
            return "bg-rose-50 text-rose-700 border-rose-200";
        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
};

export const getRoleColor = (role: string): string => {
    switch (role) {
        case "Client":
        case "CLIENT":
            return "bg-sky-50 text-sky-700 border-sky-200";
        case "Provider":
        case "PROVIDER":
            return "bg-violet-50 text-violet-700 border-violet-200";
        case "Admin":
        case "ADMIN":
            return "bg-slate-100 text-slate-700 border-slate-200";
        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
};

export const getPriorityColor = (priority: string): string => {
    switch (priority) {
        case "high":
            return "bg-rose-50 text-rose-700 border-rose-200";
        case "medium":
            return "bg-amber-50 text-amber-800 border-amber-200";
        case "low":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
};

export const getPaymentStatusColor = (status: string): string => {
    switch (status) {
        case "completed":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "pending":
            return "bg-amber-50 text-amber-800 border-amber-200";
        case "failed":
            return "bg-rose-50 text-rose-700 border-rose-200";
        case "refunded":
            return "bg-sky-50 text-sky-700 border-sky-200";
        default:
            return "bg-slate-100 text-slate-700 border-slate-200";
    }
};
