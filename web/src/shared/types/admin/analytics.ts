export interface AnalyticsData {
    users: {
        total: number;
        growth: number;
        active: number;
        new: number;
    };
    revenue: {
        total: number;
        growth: number;
        average: number;
        projected: number;
    };
    projects: {
        total: number;
        growth: number;
        completed: number;
        active: number;
    };
    engagement: {
        rate: number;
        growth: number;
        duration: string;
        pages: number;
    };
}
