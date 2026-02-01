import React, { useRef, useState, useMemo } from "react";
import { Menu, X, User, LogOut, Settings, Mail, Shield, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/use-auth";
import { toast } from "sonner";
import { LoadingModal } from "./loading-modal";

// Define link configuration with role-based visibility
interface NavLink {
  name: string;
  path: string;
  roles?: string[];
  requiresAuth?: boolean;
  hideWhenAuth?: boolean;
  icon?: React.ReactNode;
}

const allLinks: NavLink[] = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Projects",
    path: "/projects",
    requiresAuth: true,
  },
  {
    name: "Services",
    path: "/services",
  },
  {
    name: "Browse Requests",
    path: "/public-requests",
    requiresAuth: true,
    roles: ["PROVIDER_APPROVED"],
    icon: <Briefcase size={16} className="mr-1" />,
  },
  {
    name: "Admin",
    path: "/admin",
    requiresAuth: true,
    roles: ["ADMIN", "SUPER_ADMIN"],
    icon: <Shield size={16} className="mr-1" />,
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [loadingModal, setLoadingModal] = useState(false);

  // State to simulate user authentication
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // 👈 store timer reference

  const handleRedirect = (path: string) => () => {
    setLoadingModal(true);
    timerRef.current = setTimeout(() => {
      navigate(path);
      setLoadingModal(false);
    }, 2000);
  };

  // Mock user data
  const handleLogout = async () => {
    const data = await logout();
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    toast.success(data.message, {
      style: {
        background: "#ffffff",
        color: "#7682e8",
        border: "1px solid #7682e8",
      },
    });
    handleRedirect("/")();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: any) => {
    if (e.target.closest(".profile-dropdown") === null) {
      setIsProfileDropdownOpen(false);
    }
  };

  // Add event listener to close dropdown when clicking outside
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter links based on user role and authentication
  const visibleLinks = useMemo(() => {
    return allLinks.filter((link) => {
      // If link requires auth but user is not authenticated, hide it
      if (link.requiresAuth && !isAuthenticated) {
        return false;
      }

      // If link should be hidden when authenticated, hide it
      if (link.hideWhenAuth && isAuthenticated) {
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

  if (isLoading) return null;
  const currentUser = {
    name: user?.firstName + " " + user?.lastName,
    email: user?.email,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format",
  };
  return (
    <>
      {loadingModal && <LoadingModal />}

      {/* Fixed Navbar */}
      <nav className="flex items-center h-[5rem] fixed top-4 left-0 w-[85%] min-w-fit rounded-full transform translate-x-[8%] z-[1000] bg-white shadow-md border-b border-gray-200">
        <div className="w-full px-4 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center w-full h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button onClick={handleRedirect("/")} className="cursor-pointer">
                <img
                  src="/logo/no-violet-cut.png"
                  alt="logo"
                  className="w-[10rem] h-24"
                />
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden [@media(min-width:1200px)]:flex md:gap-2">
              <div className="ml-10 flex items-center space-x-4">
                {visibleLinks.map(({ name, path, icon }) => (
                  <button
                    key={name}
                    onClick={handleRedirect(path)}
                    className="cursor-pointer text-gray-700 hover:text-[#7682e8] px-3 py-2 rounded-md text-base font-medium transition-all duration-300 flex items-center"
                  >
                    {icon}{name}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden [@media(min-width:1200px)]:flex md:gap-2 items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4 relative profile-dropdown">
                  <div className="relative">
                    <img
                      className="h-8 w-8 rounded-full cursor-pointer hover:ring-2 hover:ring-[#7682e8] transition-all"
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      onClick={toggleProfileDropdown}
                    />

                    {/* Profile Dropdown */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {currentUser.name}
                          </p>
                          <div className="flex gap-2 items-center mt-1 overflow-x-hidden">
                            <div className="w-fit h-fit">
                              <Mail size={12} className="text-[#7682e8]" />
                            </div>
                            <p className="text-xs text-gray-500 flex items-center">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate("/profile");
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User size={16} className="mr-2" /> Profile
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            navigate("/profile/settings");
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Settings size={16} className="mr-2" /> Settings
                        </button>
                        <div className="border-t border-gray-100"></div>
                        <button
                          onClick={handleLogout}
                          className="cursor-pointer flex w-full items-center px-4 py-2 text-sm text-rose-500 hover:bg-gray-100"
                        >
                          <LogOut size={16} className="mr-2" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleRedirect("/login")}
                    className="cursor-pointer text-gray-700 hover:text-[#7682e8] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleRedirect("/signup")}
                    className="cursor-pointer h-[3rem] w-[10rem] bg-[#7682e8] hover:bg-[#ccd0f5] rounded-full text-white px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="[@media(min-width:1200px)]:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-[#7682e8] p-2 rounded-md transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="[@media(min-width:1200px)]:hidden bg-white border-t border-gray-200 shadow-lg w-full absolute bottom-[-24rem]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {visibleLinks.map(({ name, path, icon }) => (
                <button
                  key={name}
                  onClick={handleRedirect(path)}
                  className="cursor-pointer text-gray-700 hover:text-[#7682e8] px-3 py-2 rounded-md text-base font-medium transition-all duration-300 flex items-center"
                >
                  {icon}{name}
                </button>
              ))}
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={currentUser.avatar}
                        alt={currentUser.name}
                      />
                      <div>
                        <p className="text-base font-medium text-gray-800">
                          {currentUser.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="block text-gray-700 hover:text-[#7682e8] px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/profile/settings");
                      }}
                      className="block text-gray-700 hover:text-[#7682e8] px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-gray-700 hover:text-[#7682e8] px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 px-3">
                    <button
                      onClick={handleRedirect("/login")}
                      className="cursor-pointer w-full text-left text-[#7682e8] px-3 py-2 rounded-md text-base font-medium transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleRedirect("/signup")}
                      className="cursor-pointer w-full bg-[#7682e8] hover:bg-gray-950 text-white px-4 py-2 rounded-md text-base font-medium transition-all duration-300"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
