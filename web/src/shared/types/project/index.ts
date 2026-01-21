export interface ActiveProject {
    id: string;
    name: string;
    client: string;
    provider: string;
    status: "in_progress" | "review" | "completed" | "dispute";
    progress: number;
    budget: string;
    deadline: string;
    priority: "high" | "medium" | "low";
}
