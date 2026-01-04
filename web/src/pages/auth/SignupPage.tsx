import { LoadingModal } from "@/components/common/loading-modal";
import { useAuth } from "@/hooks/use-auth";
import { SignupFormData, SignupFormErrors } from "@/types/auth-types";
import { AlertCircle, Eye, EyeOff, LoaderCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  });
  const [formErrors, setFormErrors] = useState<SignupFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Lynkr | Register";
  }, []);
  // Delay the redirection to another page and view and hide the loading modal
  const [loadingModal, setLoadingModal] = useState(false);
  const handleRedirect = (path: string) => () => {
    setLoadingModal(true);
    setTimeout(() => {
      navigate(path);
      setLoadingModal(false);
    }, 1000);
  };

  const countries = [
    "United States",
    "Canada",
    "Mexico",
    "United Kingdom",
    "Germany",
    "France",
    "Japan",
    "Australia",
    "Brazil",
    "India",
  ];

  const checkPasswordStrength = (password: string) => {
    setStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    });
  };

  useEffect(() => {
    checkPasswordStrength(formData.password);
  }, [formData.password]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateField = (name: keyof SignupFormData, value: string): string => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        } else if (value.trim().length < 2 || value.trim().length > 20) {
          error = "First name must be at between 2 - 20 characters";
        }
        break;

      case "lastName":
        if (!value.trim()) {
          error = "Last name is required";
        } else if (value.trim().length < 2 || value.trim().length > 20) {
          error = "Last name must be at between 2 - 20 characters";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "country":
        if (!value) {
          error = "Please select your country";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (
          !strength.uppercase ||
          !strength.lowercase ||
          !strength.number ||
          !strength.symbol
        ) {
          error =
            "Password must include uppercase, lowercase, number, and symbol";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = (): boolean => {
    const errors: SignupFormErrors = {};

    (Object.keys(formData) as Array<keyof SignupFormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
      }
    });

    setFormErrors(errors);

    const isValid = Object.keys(errors).length === 0 && allCriteriaMet;
    return isValid;
  };

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Validate field after a short delay
    setTimeout(() => {
      const error = validateField(field, value);
      setFormErrors((prev) => ({
        ...prev,
        [field]: error || undefined,
      }));
    }, 300);
  };

  const handleBlur = (field: keyof SignupFormData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const error = validateField(field, formData[field]);
    setFormErrors((prev) => ({
      ...prev,
      [field]: error || undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    const isValid = validateForm();
    if (isValid) {
      setIsLoading(true);
      const data = await signup(formData);
      if (!data.success) {
        toast.error(
          data.message ||
            "Something Went Wrong while trying to register you data."
        );
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

      handleRedirect("/register-verification")();
    }
  };

  const StrengthIndicator = ({
    label,
    valid,
  }: {
    label: string;
    valid: boolean;
  }) => (
    <div className="flex items-center">
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          valid ? "bg-green-500" : "bg-gray-300"
        }`}
      ></div>
      <span className={`text-sm ${valid ? "text-gray-700" : "text-gray-500"}`}>
        {label}
      </span>
    </div>
  );

  const allCriteriaMet = Object.values(strength).every(Boolean);

  // Check if form is valid for submit button
  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.country &&
      formData.password &&
      allCriteriaMet &&
      Object.keys(formErrors).length === 0
    );
  };

  return (
    <>
      {loadingModal && <LoadingModal />}
      <div className="min-h-screen flex font-sans">
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-left mb-8">
              <h1 className="text-[4rem] text-[#7682e8] font-pacifico font-extralight">
                <button
                  onClick={handleRedirect("/")}
                  className="cursor-pointer"
                >
                  lynkr
                </button>
              </h1>
            </div>
            <div className="text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600">
                Join our community of Engineers and Providers.
              </p>
            </div>

            <button
              type="button"
              className="cursor-pointer w-full bg-white border border-gray-300 rounded-lg py-3 px-4 mb-6 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
            >
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

            <div>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    onBlur={() => handleBlur("firstName")}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-transparent ${
                      formErrors.firstName && touched.firstName
                        ? "border-rose-500 ring-1 ring-rose-500"
                        : ""
                    }`}
                  />
                  {formErrors.firstName && touched.firstName && (
                    <div className="flex gap-2 items-start mt-1">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <p className="text-sm text-rose-500">
                        {formErrors.firstName}
                      </p>
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    onBlur={() => handleBlur("lastName")}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-transparent ${
                      formErrors.lastName && touched.lastName
                        ? "border-rose-500 ring-1 ring-rose-500"
                        : ""
                    }`}
                  />
                  {formErrors.lastName && touched.lastName && (
                    <div className="flex gap-2 items-start mt-1">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <p className="text-sm text-rose-500">
                        {formErrors.lastName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-transparent ${
                    formErrors.email && touched.email
                      ? "border-rose-500 ring-1 ring-rose-500"
                      : ""
                  }`}
                />
                {formErrors.email && touched.email && (
                  <div className="flex gap-2 items-center mt-1">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-sm text-rose-500">{formErrors.email}</p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  onBlur={() => handleBlur("country")}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-transparent bg-white ${
                    formErrors.country && touched.country
                      ? "border-rose-500 ring-1 ring-rose-500"
                      : ""
                  }`}
                >
                  <option value="" disabled>
                    Select your country
                  </option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {formErrors.country && touched.country && (
                  <div className="flex gap-2 items-center mt-1">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-sm text-rose-500">
                      {formErrors.country}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6 relative">
                <div
                  className={`flex border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#7682e8] focus-within:border-transparent ${
                    formErrors.password && touched.password
                      ? "border-rose-500 ring-1 ring-rose-500"
                      : ""
                  }`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    onBlur={() => handleBlur("password")}
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

                {formErrors.password && touched.password && (
                  <div className="flex gap-2 items-start mt-1">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-sm text-rose-500">
                      {formErrors.password}
                    </p>
                  </div>
                )}
              </div>

              {/* Password strength indicators are now only shown while the user is typing*/}
              {formData.password.length > 0 && !allCriteriaMet && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 transition-opacity duration-300">
                  <StrengthIndicator
                    label="8+ characters"
                    valid={strength.length}
                  />
                  <StrengthIndicator
                    label="Uppercase"
                    valid={strength.uppercase}
                  />
                  <StrengthIndicator
                    label="Lowercase"
                    valid={strength.lowercase}
                  />
                  <StrengthIndicator label="Number" valid={strength.number} />
                  <StrengthIndicator label="Symbol" valid={strength.symbol} />
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading || !isFormValid}
                className={`cursor-pointer w-full bg-[#7682e8] text-white py-3 px-4 rounded-lg font-medium mb-6 disabled:opacity-50 disabled:cursor-not-allowed ${
                  formData.password.length === 0 || allCriteriaMet ? "mt-8" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex gap-2 items-center justify-center">
                    <LoaderCircle size={20} className="animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <div className="text-center text-xs text-gray-500 mb-2 space-x-2">
              <span> By continuing, you agree to our</span>
              <button
                type="button"
                onClick={handleRedirect("/terms")}
                className="cursor-pointer text-[#7682e8] text-sm duration-300 transition-all hover:text-gray-700 shadow-none"
              >
                Terms
              </button>
              <span>and</span>
              <button
                type="button"
                onClick={handleRedirect("/terms")}
                className="cursor-pointer text-[#7682e8] text-sm duration-300 transition-all hover:text-gray-700 shadow-none"
              >
                Privacy Policy
              </button>
            </div>

            <div className="text-center">
              <span className="text-gray-500 text-sm">
                Already have an account?
                <button
                  type="button"
                  onClick={handleRedirect("/login")}
                  className="cursor-pointer text-[#7682e8] font-medium hover:underline ml-1"
                >
                  Sign In
                </button>
              </span>
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

export default Signup;
