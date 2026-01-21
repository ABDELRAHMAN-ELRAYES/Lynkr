export interface FinancialData {
    period: string;
    revenue: string;
    commissions: string;
    refunds: string;
    net: string;
}

export interface FinancialOverview {
    totalRevenue: string;
    monthlyRevenue: string;
    transactions: string;
    pendingPayouts: string;
}
