export type AdminDashboardStats = {
    totalUsers: number;
    totalOperations: number;
    totalTransactions: number;
    totalRevenue: number;
};

export type AdminResponse = {
    stats?: AdminDashboardStats;
    users?: any[];
};
