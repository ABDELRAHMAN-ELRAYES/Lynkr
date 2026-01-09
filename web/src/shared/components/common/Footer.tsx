import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "@/shared/hooks/use-auth";

// Define link configuration with role-based visibility
interface FooterLink {
  name: string;
  path: string;
  roles?: string[]; // If specified, only these roles can see the link
  requiresAuth?: boolean; // If true, user must be authenticated
}

const allFooterLinks: FooterLink[] = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Services",
    path: "/services",
  },
  {
    name: "Operations",
    path: "/operations",
    requiresAuth: true, // Only visible to logged-in users
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    requiresAuth: true,
    roles: ["CLIENT", "PROVIDER"], // Only clients and providers see Dashboard
  },
  {
    name: "Admin",
    path: "/admin",
    requiresAuth: true,
    roles: ["ADMIN", "SUPER_ADMIN"], // Only admins see Admin link
  },
];

const Footer = () => {
  const { user, isAuthenticated } = useAuth();

  // Filter links based on user role and authentication
  const visibleLinks = useMemo(() => {
    return allFooterLinks.filter((link) => {
      // If link requires auth but user is not authenticated, hide it
      if (link.requiresAuth && !isAuthenticated) {
        return false;
      }

      // If link has role restrictions, check if user has the required role
      if (link.roles && link.roles.length > 0) {
        if (!user?.role || !link.roles.includes(user.role)) {
          return false;
        }
      }

      return true;
    });
  }, [isAuthenticated, user?.role]);

  return (
    <footer className="px-4 lg:px-24 py-16 bg-white">
      <div className="max-w-[90rem] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-8 lg:space-y-0">
          <div className="flex items-center gap-12">
            <nav className="flex gap-8">
              {visibleLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-gray-700 hover:text-[#7682e8] px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="text-center">
            <div className="text-brand-purple-600 font-bold mb-4">
              Need Help!, Contact Us Now
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center mt-16 pt-8">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div>
              <Link to="/">
                <img
                  src="/logo/no-violet-cut.png"
                  alt="logo"
                  className="w-[10rem] h-24"
                />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className=" font-inter text-sm text-gray-600">
                © Lynkr.
              </span>
              <span className=" font-inter text-sm text-gray-600">2025</span>
            </div>
          </div>

          <div className=" font-inter text-sm text-gray-600">
            All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

