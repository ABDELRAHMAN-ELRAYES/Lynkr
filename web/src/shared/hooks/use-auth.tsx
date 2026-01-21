import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { apiClient } from "@/shared/services/api-client";
import { LoadingModal } from "@/shared/components/common/loading-modal";
import {
  LoginFormData,
  SignupFormData,
  User,
  UserRole,
} from "@/shared/types/auth";

// Pending data while the registration process
type PendingDataType = {
  email: string;
  otp: string;
  isVerified: boolean;
};

// Context type Defining the ingredients of the contexxt stored conttainer
type AuthContextType = {
  user: User | null;
  pendingData?: PendingDataType;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: ({ email, password }: LoginFormData) => Promise<{
    success: boolean;
    user?: User;
    message: string;
  }>;
  signup: ({
    email,
    password,
    firstName,
    lastName,
    country,
  }: SignupFormData) => Promise<{
    success: boolean;
    user?: User;
    message: string;
  }>;
  verifyAccount: () => void;
  registerUser: (
    role: UserRole
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<{ success: boolean; message: string }>;
};

// The context itself
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// the contexxt provider(works as a bridge between the context and the entire app)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingData, setPendingData] = useState<PendingDataType>();

  // Check if there is an active session and get the current user data if there is a session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await apiClient({
          url: "/auth/me",
          options: { method: "GET" },
        });
        const fetchedUser = {
          id: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          country: data.country,
          isActive: data.is_active,
          role: data.role,
        };
        setUser(fetchedUser);
        setIsAuthenticated(true);
      } catch (error: any) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // login handler
  const login = async ({ email, password }: LoginFormData) => {
    try {
      // Import the new auth service
      // Import the new auth service
      const { authService } = await import("@/shared/services/auth.service");

      const response = await authService.login({ email, password });

      if (response.success && response.data?.user) {
        const fetchedUser: User = {
          id: response.data.user.id,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          country: response.data.user.country || "",
          isActive: true,
          role: response.data.user.role as UserRole,
        };
        setUser(fetchedUser);
        setIsAuthenticated(true);

        // Check for pending/rejected provider status
        if (fetchedUser.role === "PENDING_PROVIDER") {
          return {
            success: true,
            user: fetchedUser,
            message:
              "Your provider application is under review. You'll be notified once approved.",
          };
        }

        if (fetchedUser.role === "REJECTED_PROVIDER") {
          return {
            success: true,
            user: fetchedUser,
            message:
              "Your provider application was not approved. Please contact support for more information.",
          };
        }

        return {
          success: true,
          user: fetchedUser,
          message: response.message || "You logged in successfully",
        };
      } else {
        setUser(null);
        return { success: false, message: response.message || "Login failed" };
      }
    } catch (error: any) {
      setUser(null);
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };
  // logout handler
  const logout = async () => {
    try {
      await apiClient({ url: "/auth/logout", options: { method: "POST" } });
      setUser(null);
      setIsAuthenticated(false);
      return { success: true, message: "You logged out successfully." };
    } catch (error: any) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };
  // signup handler(check if the email is registered and generate an otp) and works as a resend verification email too
  const signup = async (newUser: SignupFormData) => {
    try {
      const data = await apiClient({
        url: "/auth/register",
        options: {
          method: "POST",
          body: JSON.stringify({ email: newUser.email }),
        },
      });

      setPendingData({ email: data.email, otp: data.otp, isVerified: false });
      setUser({
        id: "pending_id",
        role: "CLIENT",
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        country: newUser.country,
        password: newUser.password,
        isActive: false,
      });
      return {
        success: true,
        message:
          "We Send You a one time password to verify your account, Check your Inbox.",
      };
    } catch (error: any) {
      setUser(null);
      return {
        success: false,
        message:
          error.message ||
          "Something went wrong while Trying to register your data",
      };
    } finally {
      setIsLoading(false);
    }
  };
  // to verify the account if the otp is verified
  const verifyAccount = () => {
    setPendingData((prev: PendingDataType | undefined) =>
      prev
        ? { ...prev, isVerified: true }
        : { email: "", otp: "", isVerified: false }
    );
  };

  const registerUser = async (role: UserRole) => {
    console.log({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      password: user?.password,
      country: user?.country,
      role,
    });

    try {
      const data = await apiClient({
        url: "/auth/register-verification",
        options: {
          method: "POST",
          body: JSON.stringify({
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            password: user?.password,
            country: user?.country,
            role,
          }),
        },
      });

      setUser({
        id: data.id,
        role: data.role,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        country: data.country,
        isActive: data.is_active,
      });
      setIsAuthenticated(true);
      return {
        success: true,
        message:
          role === "CLIENT"
            ? "Welcome to Lynkr."
            : "You are being redirected to complete your data.",
      };
    } catch (error: any) {
      setUser(null);
      return {
        success: false,
        message:
          error.message ||
          "Something went wrong while Trying to register your data",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    signup,
    pendingData,
    verifyAccount,
    registerUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <LoadingModal />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
