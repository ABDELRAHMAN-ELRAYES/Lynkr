import { useState, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/shared/services";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    token?: string;
  }>({});

  // Validate token is present
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      navigate("/forget-password");
    }
  }, [token, navigate]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const getPasswordStrength = (
    password: string
  ): { strength: string; color: string } => {
    if (password.length === 0) return { strength: "", color: "" };
    if (password.length < 8) return { strength: "Weak", color: "text-red-400" };

    let score = 0;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[^a-zA-Z\d])/.test(password)) score++;

    if (score < 2) return { strength: "Weak", color: "text-red-400" };
    if (score < 4) return { strength: "Medium", color: "text-yellow-400" };
    return { strength: "Strong", color: "text-green-400" };
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!token) {
      toast.error("Invalid reset token");
      navigate("/forget-password");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({ token, password });

      if (response.success) {
        toast.success("Password reset successful!");
        setIsSubmitted(true);
      } else {
        toast.error(response.message || "Failed to reset password");
        if (response.message?.toLowerCase().includes("expired") ||
          response.message?.toLowerCase().includes("invalid")) {
          setErrors({ token: response.message });
        }
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-lg rounded-2xl border border-gray-300 p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto my-6">
                <div className="cursor-pointer text-[4rem] text-[#7682e8] font-pacifico font-extralight">
                  lynkr
                </div>
              </div>
              {/* <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div> */}
              <h2 className="text-2xl font-bold mb-2">
                Password Reset Successfully!
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                Your password has been updated successfully.
                <br />
                You can now sign in with your new password.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleBackToLogin}
                className="w-full bg-[#7682e8] cursor-pointer group text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 border border-white/20 hover:border-white/30 flex items-center justify-center gap-2"
              >
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:-translate-x-2 duration-500 transition-all">
                  <ArrowLeft className="w-3 h-3" />
                </div>
                Back to Login
              </button>
            </div>

            <p className="text-xs mt-6 text-gray-500">
              Keep your password secure and don't share it with anyone.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-start mb-4 flex items-start border border-gray-300 rounded-2xl p-4 gap-4">
          <div>
            <div className="cursor-pointer text-[4rem] text-[#7682e8] font-pacifico font-extralight">
              lynkr
            </div>
          </div>
          <div className="border-l border-gray-300 pl-2">
            <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
            <p className="text-sm text-gray-500 font-medium">
              Create a new secure password for your account.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="backdrop-blur-lg rounded-2xl border border-gray-300 p-8">
          <div className="space-y-6">
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                New Password
              </label>
              <div className="relative border border-gray-300 rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 bg-white/5 text-black border ${errors.password ? "border-red-400" : "border-white/20"
                    } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-transparent transition-all duration-200 backdrop-blur-sm`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && !errors.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.strength === "Weak"
                          ? "w-1/3 bg-red-400"
                          : passwordStrength.strength === "Medium"
                            ? "w-2/3 bg-yellow-400"
                            : "w-full bg-green-400"
                        }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${passwordStrength.color}`}
                  >
                    {passwordStrength.strength}
                  </span>
                </div>
              )}

              {errors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative border border-gray-300 rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 bg-white/5 text-black border ${errors.confirmPassword
                      ? "border-red-400"
                      : "border-white/20"
                    } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-transparent transition-all duration-200 backdrop-blur-sm`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-medium mb-2 text-gray-700">
                Password Requirements:
              </h4>
              <div className="space-y-1">
                {[
                  { label: "At least 8 characters", met: password.length >= 8 },
                  {
                    label: "One lowercase letter",
                    met: /(?=.*[a-z])/.test(password),
                  },
                  {
                    label: "One uppercase letter",
                    met: /(?=.*[A-Z])/.test(password),
                  },
                  { label: "One number", met: /(?=.*\d)/.test(password) },
                ].map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-400"
                        }`}
                    >
                      {req.met && <Check className="w-3 h-3" />}
                    </div>
                    <span
                      className={`text-xs ${req.met ? "text-green-600" : "text-gray-500"
                        }`}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-[#7682e8] cursor-pointer text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 duration-500 transition-all group-hover:-translate-x-2" />
                  Update Password
                </>
              )}
            </button>
          </div>

          <div className="mt-0 pt-6 border-t border-white/10">
            <div className="w-full py-2 px-4 font-medium transition-colors duration-200 flex items-center justify-center gap-2 hover:bg-white/5 rounded-xl">
              <span className="text-gray-500 text-sm">
                Remember your password?
                <a
                  className="text-gray-900 underline hover:text-gray-700 ml-2"
                  href="/login"
                  data-discover="true"
                >
                  Sign in
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs">
            Need help? Contact our{" "}
            <a
              href="#"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
