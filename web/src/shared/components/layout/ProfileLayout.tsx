
import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  User,
  Briefcase,
  FolderOpen,
  Calendar,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Plus,
  ClipboardList,
} from "lucide-react";
import Profile from "@/features/profile/components/Profile";
import { ClientProfile } from "@/features/profile/components/ClientProfile";
import Navbar from "@/shared/components/common/Navbar";
import Footer from "@/shared/components/common/Footer";
import Button from "@/shared/components/ui/Button";
import { useAuth } from "@/shared/hooks/use-auth";

// Provider navigation items
const providerNav = [
  { to: "", label: "Profile", icon: User },
  {
    to: "requests",
    label: "Available Requests",
    icon: ClipboardList,
  },
  {
    to: "services",
    label: "Services & Pricing",
    icon: Briefcase,
  },
  {
    to: "portfolio",
    label: "Portfolio",
    icon: FolderOpen,
  },
  {
    to: "availability",
    label: "Availability",
    icon: Calendar,
  },
  {
    to: "documents",
    label: "Documents",
    icon: FileText,
  },
  {
    to: "finance",
    label: "Manage financial",
    icon: CreditCard,
  },
  {
    to: "settings",
    label: "Settings",
    icon: Settings,
  },
];

// Client navigation items
const clientNav = [
  { to: "", label: "Profile", icon: User },
  {
    to: "requests",
    label: "My Requests",
    icon: ClipboardList,
  },
  {
    to: "settings",
    label: "Settings",
    icon: Settings,
  },
];

function RightSidebar() {
  const { user } = useAuth();
  const isClient = user?.role === 'CLIENT';

  if (isClient) {
    return (
      <aside className="w-80 p-6 space-y-6 hidden xl:block">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              onClick={() => window.location.href = '/services'}
              className="cursor-pointer w-full flex items-center justify-center px-4 py-2 bg-[#7682e8] text-white rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Browse Services
            </Button>
            <Button
              onClick={() => window.location.href = '/requests'}
              className="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              View My Requests
            </Button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 p-6 space-y-6 hidden xl:block">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg text-gray-900 mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Profile Views (7d)</span>
            <span className="text-gray-900 font-medium">342</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">New Messages</span>
            <span className="text-gray-900 font-medium">12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pending Reviews</span>
            <span className="text-gray-900 font-medium">3</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button
            onClick={() => window.location.href = '/profile/requests'}
            className="cursor-pointer w-full flex items-center justify-center px-4 py-2 bg-[#7682e8] text-white rounded-lg"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            View Available Requests
          </Button>
          <Button
            className="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2 " />
            Create New Service
          </Button>
          <button className="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2" />
            Connect Calendar
          </button>
          <Button
            className="cursor-pointer w-full flex items-center justify-center px-4 py-2 border border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <FileText className="w-3 h-4 mr-2" />
            Verify Documents
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg text-gray-900 mb-4">Recent Messages</h3>
        <div className="space-y-4">
          <div className="flex space-x-3">
            <img
              src="https://api.builder.io/api/image/assets/TEMP/79cd7076f08da433438b02fcb4d37c2034b9f708?width=64"
              alt="Sarah Chen"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">Sarah Chen</p>
              <p className="text-sm text-gray-600 truncate">
                Question about CFD analysis timeline...
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <img
              src="https://api.builder.io/api/image/assets/TEMP/abc58ac8712073485444a6525a49784768cf2a01?width=64"
              alt="Michael Rodriguez"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                Michael Rodriguez
              </p>
              <p className="text-sm text-gray-600 truncate">
                Ready to start the thermal analysis project
              </p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function ProfileLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isClient = user?.role === 'CLIENT';
  const nav = isClient ? clientNav : providerNav;

  return (
    <div className="min-h-screen ">
      <Navbar />
      <div className="flex justify-center max-w-[90rem] mx-auto my-[8rem]">
        <aside className="w-64 bg-white border border-gray-200 rounded-xl min-h-screen hidden md:block mt-[24px]">
          <div className="p-6">
            <h2 className="text-lg font-normal text-gray-900 mb-8">
              {isClient ? "Account" : "Profile Management"}
            </h2>
            <nav className="space-y-2">
              {nav.map(({ to, label, icon: Icon }) => {
                const active =
                  (to === "" && pathname === "/profile") ||
                  (to !== "" && pathname === `/profile/${to}`) ||
                  (to !== "" && pathname.startsWith(`/profile/${to}/`));
                return (
                  <Link
                    key={to}
                    to={`/profile/${to}`}
                    className={`flex items-center px-3 py-2 rounded-lg ${active
                      ? "bg-gray-50 text-gray-600"
                      : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span className="font-normal">{label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="w-64 border-top border-gray-100  flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <div className="flex items-center cursor-pointer">
                <LogOut className="w-4 h-4 text-rose-500 mr-3" />
                <span className="text-sm text-rose-500">Logout</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 max-w-[55rem] w-full">{<Outlet />}</main>
        <RightSidebar />

      </div>


      <div className="max-w-[90rem] h-px bg-gray-300 mx-auto"></div>
      <Footer />
    </div>
  );
}
