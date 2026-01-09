import React, { useState, useRef, useEffect } from "react";
import { Mail, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/shared/hooks/use-auth";
import { LoadingModal } from "@/shared/components/common/loading-modal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function OTPVerificationPage() {
  const { pendingData, user, signup, verifyAccount } = useAuth();
  const [enteredOtp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [maxResendAttempts] = useState(3);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { email, otp } = pendingData || { email: "", otp: "" };
  const navigate = useNavigate();

  // Redirect to login if no OTP is available
  useEffect(() => {
    if (!pendingData?.otp) {
      toast.error("No verification code found. Please Register again.");
      navigate("/signup");
    }
  }, [pendingData?.otp, navigate]);

  // Delay the redirection to another page and view and hide the loading modal
  const [loadingModal, setLoadingModal] = useState(false);
  const handleRedirect = (path: string) => () => {
    setLoadingModal(true);
    setTimeout(() => {
      navigate(path);
      setLoadingModal(false);
    }, 1000);
  };

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft]);

  useEffect(() => {
    document.title = "Lynkr | Register Verification";
    inputRefs.current[0]?.focus();
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    // Only allow single digit and numbers
    if (value.length > 1 || (value && !/^\d$/.test(value))) return;

    setError(""); // Clear error on input
    const newOtp = [...enteredOtp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Auto-submit when all fields are filled
    if (value && index === 5) {
      const completeOtp = [...newOtp];
      completeOtp[index] = value;
      if (completeOtp.every((digit) => digit !== "")) {
        // Small delay to show the last digit before verifying
        setTimeout(() => {
          handleVerify(completeOtp.join(""));
        }, 100);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...enteredOtp];

      if (enteredOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, ""); // Remove non-digits

    if (pastedData.length >= 6) {
      const newOtp = pastedData.slice(0, 6).split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      setTimeout(() => {
        handleVerify(newOtp.join(""));
      }, 100);
    }
  };

  const handleVerify = async (otpValue?: string) => {
    const codeToVerify = otpValue || enteredOtp.join("");

    if (codeToVerify.length !== 6) {
      setError("Please enter the complete 6-digit code");
      const firstEmptyIndex = enteredOtp.findIndex((digit) => digit === "");
      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (codeToVerify === otp) {
        verifyAccount();
        toast.success(
          "Verified, You are being Redirected To Complete the registration process",
          {
            style: {
              background: "#ffffff",
              color: "#7682e8",
              border: "1px solid #7682e8",
            },
          }
        );
        setTimeout(() => {
          handleRedirect("/client-or-provider")();
        }, 2000);
      } else {
        toast.error("Invalid verification code. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }
    } catch (err) {
      toast.error("Verification failed. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }

    setIsLoading(false);
  };

  const handleResendCode = async () => {
    if (!canResend || resendLoading || resendAttempts >= maxResendAttempts)
      return;

    setResendLoading(true);
    setError("");

    try {
      if (!user) {
        navigate("/signup");
        return;
      }
      const data = await signup({
        email: user?.email || "",
        password: user?.password || "",
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
      });
      if (!data.success) {
        toast.error(
          data.message ||
            "Something Went Wrong while trying to resend a verification mail."
        );
        return;
      }

      const newAttempts = resendAttempts + 1;
      setResendAttempts(newAttempts);

      setTimeLeft(180);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);

      toast.success(
        `Verification code sent! Attempts remaining: ${
          maxResendAttempts - newAttempts
        }`,
        {
          style: {
            background: "#ffffff",
            color: "#7682e8",
            border: "1px solid #7682e8",
          },
        }
      );

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

      if (newAttempts >= maxResendAttempts) {
        toast.error("Maximum resend attempts reached. Please try again later.");
      }
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    }

    setResendLoading(false);
  };

  if (!pendingData?.otp) {
    return <LoadingModal />;
  }

  const hasMaxAttempts = resendAttempts >= maxResendAttempts;

  return (
    <>
      {loadingModal && <LoadingModal />}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {}
          <div className="text-start mb-4 flex items-start border border-gray-300 rounded-2xl p-4 gap-4">
            <div>
              <div className="cursor-pointer text-[4rem] text-[#7682e8] font-pacifico font-extralight">
                lynkr
              </div>
            </div>
            <div className="border-l border-gray-300 pl-2">
              <h1 className="text-3xl font-bold mb-2">Verify Your Email</h1>
              <p className="text-sm text-gray-500 font-medium">
                We've sent a 6-digit code to complete your signup.
              </p>
            </div>
          </div>

          {}
          <div className="backdrop-blur-lg rounded-2xl border border-gray-300 p-8">
            <div className="space-y-6">
              {}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl mb-4">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">{email}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Enter the verification code sent to your email
                </p>
              </div>

              {}
              <div>
                <label className="block text-sm font-medium mb-4 text-center">
                  Verification Code
                </label>
                <div className="flex gap-3 justify-center mb-4">
                  {enteredOtp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      disabled={isLoading || hasMaxAttempts}
                      className={`w-12 h-12 text-center text-xl font-bold border-2 ${
                        error
                          ? "border-red-400 bg-red-50"
                          : digit
                          ? "border-[#7682e8] bg-blue-50"
                          : "border-gray-300 bg-white"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:border-[#7682e8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>

                {error && (
                  <div className="text-sm text-red-400 flex items-center justify-center gap-1 mb-4 bg-red-50 p-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {}
                <div className="text-center space-y-2">
                  {}
                  {resendAttempts > 0 && (
                    <p className="text-sm text-gray-600">
                      Resend attempts: {resendAttempts}/{maxResendAttempts}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-center">
                <button
                  onClick={handleResendCode}
                  disabled={!canResend || resendLoading || hasMaxAttempts}
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                    canResend && !resendLoading && !hasMaxAttempts
                      ? "text-[#7682e8] hover:text-[#5a67d8] hover:bg-blue-50 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  {resendLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {resendLoading
                    ? "Sending..."
                    : hasMaxAttempts
                    ? "Maximum Attempts Reached"
                    : "Resend Code"}
                </button>

                {!canResend && !resendLoading && !hasMaxAttempts && (
                  <p className="text-xs text-gray-500 mt-1">
                    You can resend in {formatTime(timeLeft)}
                  </p>
                )}

                {hasMaxAttempts && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    Maximum resend attempts reached. Please try again later.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="w-full py-2 px-4 font-medium transition-colors duration-200 flex items-center justify-center gap-2 hover:bg-white/5 rounded-xl">
                <span className="text-gray-500 text-sm">
                  Wrong email address?
                  <a
                    className="text-gray-900 underline hover:text-gray-700 ml-2"
                    href="/signup"
                    data-discover="true"
                  >
                    Go back
                  </a>
                </span>
              </div>
            </div>
          </div>

          {}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500">
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
    </>
  );
}
