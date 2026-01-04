import { LoadingModal } from "@/components/common/loading-modal";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/use-auth";
import { LoginFormData } from "@/types/auth-types";
import { AlertCircle, Eye, EyeOff, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type LoginFormErrors = Partial<LoginFormData>;

const Login = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Lynkr | Login";
  }, []);
  // Delay the redirection to another page and view and hide the loading modal
  const [loadingModal, setLoadingModal] = useState(false);
  const handleRedirect = (path: string) => () => {
    setLoadingModal(true);
    setTimeout(() => {
      navigate(path);
      setLoadingModal(false);
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const validateField = (
    name: keyof LoginFormData,
    value: string,
    errorMessage: string
  ) => {
    if (name === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address",
        }));
      } else if (!value) {
        setFormErrors((prev) => ({ ...prev, email: "Email is required" }));
      } else {
        setFormErrors((prev) => ({ ...prev, email: undefined }));
      }
      return;
    }

    if (value) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    } else {
      setFormErrors((prev) => ({ ...prev, [name]: errorMessage }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email || !password) {
      const newErrors: LoginFormErrors = {};

      if (!email.trim()) newErrors.email = "Email is required";
      if (!password.trim()) newErrors.password = "Password is required";

      setFormErrors(newErrors);
      setIsLoading(false);
      return;
    }
    if (formErrors.email) {
      return;
    }
    const data = await login({ email, password });
    if (!data.success) {
      toast.error(data.message || "Email or Password is not correct");
      setIsLoading(false);
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
  return (
    <>
      {loadingModal && <LoadingModal />}
      <div className="min-h-screen flex font-sans">
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Welcome to
                <Button
                  onClick={handleRedirect("/")}
                  className="cursor-pointer text-[4rem] text-[#7682e8] font-pacifico font-extralight"
                >
                  lynkr
                </Button>
              </h2>
              <p className="text-gray-600">
                Log in to your account and discover world-class
                <br />
                Engineering talent.
              </p>
            </div>

            <button className="cursor-pointer w-full bg-white border border-gray-300 rounded-lg py-3 px-4 mb-6 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                Continue with Google
              </span>
            </button>

            <div className="relative text-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative inline-block px-2 bg-white text-gray-500 text-sm">
                or
              </div>
            </div>

            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => {
                  let emailValue = e.target.value;
                  setEmail(emailValue);
                  validateField("email", emailValue, "Email is Required");
                }}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-transparent ${
                  formErrors.email
                    ? "ring ring-rose-500 focus:ring-0 focus-visible:ring-rose-500"
                    : ""
                }`}
              />
              {formErrors.email && (
                <div className="flex gap-2 items-center mt-1">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <p className="text-sm text-rose-500 mt-1">
                    {formErrors.email}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-6 relative">
              <div
                className={`flex border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#7682e8] focus-within:border-transparent ${
                  formErrors.password
                    ? "ring ring-rose-500 focus-within:ring-0 focus-within:ring-rose-500"
                    : ""
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    let passwordValue = e.target.value;
                    setPassword(passwordValue);
                    validateField(
                      "password",
                      passwordValue,
                      "Password is Required"
                    );
                  }}
                  className="w-full px-4 py-3 border-none focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="px-4 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {formErrors.password && (
                <div className="flex gap-2 items-center mt-1">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <p className="text-sm text-rose-500">{formErrors.password}</p>
                </div>
              )}
            </div>
            <div className="mb-4">
              <button
                onClick={handleRedirect("/forget-password")}
                className="cursor-pointer text-[#7682e8] text-sm font-bold"
              >
                Forget Password?
              </button>
            </div>

            <button
              className={`cursor-pointer w-full bg-[#7682e8] text-white py-3 px-4 rounded-lg font-medium transition-colors mb-6 ${
                isLoading ? "bg-[#7682e880]" : ""
              }`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex gap-2 items-center justify-center">
                  <LoaderCircle size={20} className="animate-spin" />
                  <span>loging...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center text-xs text-gray-500 mb-2 space-x-2">
              <span> By continuing, you agree to our</span>
              <button
                onClick={handleRedirect("/terms")}
                className="cursor-pointer text-[#7682e8] text-sm duration-300 transition-all hover:text-gray-700 shadow-none"
              >
                Terms
              </button>
              <span>and</span>
              <button
                onClick={handleRedirect("/terms")}
                className="cursor-pointer text-[#7682e8] text-sm duration-300 transition-all hover:text-gray-700 shadow-none"
              >
                Privacy Policy
              </button>
            </div>

            <div className="flex gap-2 justify-center items-center text-center">
              <span className="text-gray-500 text-sm">
                Don't have an account?
              </span>
              <button
                onClick={handleRedirect("/signup")}
                className="cursor-pointer text-[#7682e8] text-sm duration-300 transition-all hover:text-gray-700 shadow-none"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden hidden lg:block">
          <img
            src="/images/pages/login/bg.jpeg"
            alt=""
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 text-white/60 text-xs">
            © Lynkr
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
