import { LoadingModal } from "@/components/common/loading-modal";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types/auth-types";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export default function SignupChoice() {
  const [role, setRole] = useState<"client" | "pending_provider">("client");
  const { registerUser, pendingData } = useAuth();
  const [loadingModal, setLoadingModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // 👈 store timer reference
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Lynkr | Account Type";
    if (!pendingData?.isVerified) {
      toast.error("You are unauthorized");
      handleRedirect("/signup")();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleRedirect = (path: string) => () => {
    setLoadingModal(true);
    timerRef.current = setTimeout(() => {
      navigate(path);
      setLoadingModal(false);
    }, 1000);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await registerUser(role.toUpperCase() as UserRole);
    if (!data.success) {
      toast.error(data.message || "Email or Password is not correct");
      return;
    }
    toast.success(data.message, {
      style: {
        background: "#ffffff",
        color: "#7682e8",
        border: "1px solid #7682e8",
      },
    });
    if (role == "client") handleRedirect("/")();
    else handleRedirect("/provider-application")();
  };

  return (
    <>
      {loadingModal && <LoadingModal />}

      <div className="flex min-h-screen items-center justify-start flex-col px-4">
        <div className="w-full flex justify-start pl-12">
          <img
            src="/logo/no-violet.png"
            alt=""
            className="w-[10rem] h-[10rem] object-cover cursor-pointer duration-500 tranisition-all hover:-translate-y-2"
          />
        </div>
        <div className="mt-16">
          <div className="w-full max-w-3xl rounded-xl  p-8">
            <h1 className="mb-16 text-center text-[2.5rem] font-semibold text-gray-800">
              Join as a client or freelancer
            </h1>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                onClick={() => setRole("client")}
                className={`flex flex-col items-start rounded-lg border p-4 text-left transition ${
                  role === "client"
                    ? "border-[#7682e8] bg-[#ccd0f59d]"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center space-x-2 w-full justify-between">
                  <div className="text-lg w-8 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      data-name="Layer 1"
                      viewBox="0 0 24 24"
                      role="img"
                    >
                      <path
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                        stroke="var(--icon-color, #001e00)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M19.28 21h-6.9a1.6 1.6 0 01-1.73-1.5v-4a1.6 1.6 0 011.73-1.5h6.9A1.59 1.59 0 0121 15.5v4a1.66 1.66 0 01-1.72 1.5z"
                      ></path>
                      <path
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                        stroke="var(--icon-color, #001e00)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M16.9 12h-2.15a.65.65 0 00-.72.66V14h3.59v-1.34a.65.65 0 00-.72-.66z"
                      ></path>
                      <line
                        x1="10.65"
                        x2="21"
                        y1="17.29"
                        y2="17.29"
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                        stroke="var(--icon-color, #001e00)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></line>
                      <circle
                        cx="10.04"
                        cy="5.73"
                        r="2.73"
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                        stroke="var(--icon-color, #001e00)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></circle>
                      <path
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                        stroke="var(--icon-color, #001e00)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 18.45v-.9a7 7 0 017-7h.09a6.73 6.73 0 011.91.27"
                      ></path>
                    </svg>
                  </div>
                  <span
                    className={`h-4 w-4 rounded-full border-2 ${
                      role === "client"
                        ? "border-[#7682e8] bg-[#7682e8]"
                        : "border-gray-400"
                    }`}
                  ></span>
                </div>
                <p className="mt-2 text-[1.3rem] font-medium text-gray-700">
                  I'm a client, hiring for a project
                </p>
              </button>
              <button
                onClick={() => setRole("pending_provider")}
                className={`flex flex-col items-start rounded-lg border p-4 text-left transition ${
                  role === "pending_provider"
                    ? "border-[#7682e8] bg-[#ccd0f59d]"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center space-x-2 w-full justify-between">
                  <div className="text-lg w-8 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      role="img"
                    >
                      <path
                        vectorEffect="non-scaling-stroke"
                        stroke="var(--icon-color, #001e00)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9.43 21H5.99M3 18.45v-.9a7 7 0 017-7h.09a6.94 6.94 0 013.79 1.12m5.5 9.33h-11L10 14h11l-1.62 7zm-4.69-3a.5.5 0 100-1 .5.5 0 000 1zM12.77 5.73a2.73 2.73 0 11-5.46 0 2.73 2.73 0 015.46 0z"
                      ></path>
                    </svg>
                  </div>
                  <span
                    className={`h-4 w-4 rounded-full border-2 ${
                      role === "pending_provider"
                        ? "border-[#7682e8] bg-[#7682e8]"
                        : "border-gray-400"
                    }`}
                  ></span>
                </div>
                <p className="mt-2 text-[1.3rem] max-w-md font-medium text-gray-700">
                  I'm a provider, looking for work
                </p>
              </button>
            </div>
            <div className="w-full flex items-center justify-center">
              <button
                className="mb-4 w-fit px-12 rounded-md py-2 text-white bg-[#768de8] cursor-pointer"
                onClick={handleSubmit}
              >
                {role === "client" ? "Join as a Client" : "Join as a Provider"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?
              <button
                className="cursor-pointer text-[#7682e8] hover:underline ml-2"
                onClick={handleRedirect("/login")}
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
