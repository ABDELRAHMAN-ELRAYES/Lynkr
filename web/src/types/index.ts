export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
  joinDate: string;
  lastActive: string;
  projects: number;
  totalSpent: string;
  totalEarned: string;
  location: string;
  phone: string;
  verified: boolean;
  rating: number;
  completedProjects: number;
}

export interface PlatformStat {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: string;
}

export interface RecentActivity {
  id: number;
  type: string;
  user: string;
  action: string;
  time: string;
  status: string;
  icon: React.ReactNode;
}

export interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  badge?: string;
  items?: SubItem[];
}

export interface SubItem {
  title: string;
  url: string;
  badge?: string;
}
