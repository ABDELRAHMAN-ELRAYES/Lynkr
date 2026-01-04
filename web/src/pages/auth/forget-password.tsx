import React, { useState } from "react";
import { Mail, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";



export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
const navigate = useNavigate();
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSubmitted(true);
  };



  const handleResendEmail = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    // Show success message or handle resend logic
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className=" backdrop-blur-lg rounded-2xl border border-gray-300 p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto my-6">
                <Link
                  to="/"
                  className="cursor-pointer text-[4rem] text-[#7682e8] font-pacifico font-extralight"
                >
                  lynkr
                </Link>
              </div>
              <h2 className="text-2xl font-bold  mb-2">Check Your Email</h2>
              <p className=" text-sm leading-relaxed">
                We've sent a password reset link to
                <br />
                <span className="font-semibold block mt-4">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleResendEmail}
                disabled={isLoading}
                className="w-full bg-[#7682e8] cursor-pointer group text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-5 h-5 group-hover:-translate-x-2 duration-500 transition-all" />
                )}
                {isLoading ? "Sending..." : "Resend Email"}
              </button>

              <button
                onClick={()=> navigate("/login")}
                className="w-full text-[#7682e8]  text-sm font-medium transition-colors group cursor-pointer duration-200 flex items-center justify-center gap-2"
              >
                <div className="rounded-xl flex items-center justify-center duration-500 transition-all group-hover:-translate-x-2">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                Back to Login
              </button>
            </div>

            <p className="text-xs  mt-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-start mb-4 flex items-center justify-evenly border border-gray-300 rounded-2xl p-4 gap-4">
          <div>
            <Link
              to="/"
              className="cursor-pointer text-[4rem] text-[#7682e8] font-pacifico font-extralight"
            >
              lynkr
            </Link>
          </div>
          <div className="border-l border-gray-300 pl-2">
            <h1 className="text-3xl font-bold  mb-2">Forgot Password?</h1>
            <p className=" text-sm text-gray-500 font-medium">
              No worries, we'll send you reset instructions.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className=" backdrop-blur-lg rounded-2xl border border-gray-300 p-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium  mb-2"
              >
                Email Address
              </label>
              <div className="relative border border-gray-300 rounded-xl">
                <div className="absolute z-100 inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 text-black border ${
                    errors.email ? "border-red-400" : "border-white/20"
                  } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-transparent transition-all duration-200 backdrop-blur-sm`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
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
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 duration-500 transition-all group-hover:-translate-x-2" />
                  Send Reset Link
                </>
              )}
            </button>
          </div>

          <div className="mt-0 pt-6 border-t border-white/10">
            <div className="w-full  py-2 px-4 font-medium transition-colors duration-200 flex items-center justify-center gap-2 hover:bg-white/5 rounded-xl">
              <span className="text-gray-500 text-sm">
                Remember your password?
                <a
                  className="text-gray-900 underline hover:text-gray-700 ml-2"
                  href="/signup"
                  data-discover="true"
                >
                  Signin
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
