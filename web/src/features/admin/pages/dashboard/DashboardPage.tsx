"use client";

import { WelcomeSection } from "./components/WelcomeSection";
import { StatsGrid } from "./components/StatsGrid";
import { RecentActivity } from "./components/RecentActivity";
import { ActiveProjects } from "./components/ActiveProjects";
import { FinancialOverview } from "./components/FinancialOverview";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <WelcomeSection />
            <StatsGrid />
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivity />
                <ActiveProjects />
            </section>
            <section>
                <FinancialOverview />
            </section>
        </div>
    );
}
