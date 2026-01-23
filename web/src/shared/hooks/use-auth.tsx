import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { authService } from "@/shared/services";
import { LoadingModal } from "@/shared/components/common/loading-modal";
import type {
  LoginFormData,
  SignupFormData,
  User,
  UserRole,
} from "@/shared/types/auth";

// Pending data while the registration process
type PendingDataType = {
  email: string;
  otp: {
    code: string;
    expiresIn: string;
  };
  enteredOtp: string;
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
  verifyAccount: (enteredOtp: string) => void;
  registerUser: (role: UserRole) => Promise<{ success: boolean; message: string }>;
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
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          // Backend returns { data: { user: {...} } }
          const userData = response.data.user || response.data;
          const fetchedUser: User = {
            id: userData.id || "",
            firstName: userData.firstName || userData.first_name || "",
            lastName: userData.lastName || userData.last_name || "",
            email: userData.email || "",
            country: userData.country || "",
            isActive: userData.active ?? userData.isActive ?? userData.is_active ?? true,
            role: (userData.role as UserRole) || "CLIENT",
          };
          setUser(fetchedUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
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
      const response = await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: response.success, message: response.message || "You logged out successfully." };
    } catch (error: unknown) {
      const err = error as { message?: string };
      return { success: false, message: err.message || "Logout failed" };
    } finally {
      setIsLoading(false);
    }
  };
  // signup handler(check if the email is registered and generate an otp) and works as a resend verification email too
  const signup = async (newUser: SignupFormData) => {
    try {
      const response = await authService.register({ email: newUser.email });

      if (response.success && response.data) {
        setPendingData({
          email: response.data.email,
          otp: response.data.otp || { code: "", expiresIn: "" },
          enteredOtp: "",
          isVerified: false
        });
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
          message: "We sent you a one time password to verify your account. Check your inbox.",
        };
      } else {
        return {
          success: false,
          message: response.message || "Registration failed",
        };
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      setUser(null);
      return {
        success: false,
        message: err.message || "Something went wrong while trying to register your data",
      };
    } finally {
      setIsLoading(false);
    }
  };
  // to verify the account if the otp is verified
  const verifyAccount = (enteredOtp: string) => {
    setPendingData((prev: PendingDataType | undefined) =>
      prev
        ? { ...prev, enteredOtp, isVerified: true }
        : { email: "", otp: { code: "", expiresIn: "" }, enteredOtp: "", isVerified: false }
    );
  };

  const registerUser = async (role: UserRole) => {
    try {
      // Build payload matching backend IRegisterData structure
      const response = await authService.registerVerification({
        otp: {
          hashedOtp: pendingData?.otp.code || "",
          expiresIn: pendingData?.otp.expiresIn || "",
          enteredOtp: pendingData?.enteredOtp || "",
        },
        user: {
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          email: user?.email || "",
          password: user?.password || "",
          role,
        },
      });

      if (response.success && response.data) {
        // The backend returns { user: {...}, token, isVerified }
        const userData = response.data.user || response.data;
        setUser({
          id: userData.id,
          role: userData.role as UserRole,
          firstName: userData.first_name || userData.firstName,
          lastName: userData.last_name || userData.lastName,
          email: userData.email,
          country: userData.country,
          isActive: userData.is_active ?? userData.active ?? true,
        });
        setIsAuthenticated(true);
        return {
          success: true,
          message:
            role === "CLIENT"
              ? "Welcome to Lynkr."
              : "You are being redirected to complete your data.",
        };
      } else {
        return {
          success: false,
          message: response.message || "Registration verification failed",
        };
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      setUser(null);
      return {
        success: false,
        message: err.message || "Something went wrong while trying to register your data",
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
