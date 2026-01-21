import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoadingModal } from "@/shared/components/common/loading-modal";
import { useAuth } from "@/shared/hooks/use-auth";

/**
 * Google OAuth Callback Page
 * 
 * Handles the callback after Google OAuth authentication.
 * The backend redirects here with query parameters:
 * - type=login&success=true -> User authenticated, redirect to home
 * - type=register&data=base64EncodedUserData -> New user, redirect to signup with pre-filled data
 * - error=... -> Authentication error
 */
export default function GoogleOAuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [processing, setProcessing] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            const type = searchParams.get("type");
            const success = searchParams.get("success");
            const data = searchParams.get("data");
            const error = searchParams.get("error");

            // Handle error cases
            if (error) {
                toast.error(getErrorMessage(error));
                navigate("/login");
                return;
            }

            // Handle successful login
            if (type === "login" && success === "true") {
                toast.success("Successfully signed in with Google!");
                // The backend has already set the JWT cookie
                // Wait a moment for the cookie to be set, then redirect
                setTimeout(() => {
                    window.location.href = "/";
                }, 500);
                return;
            }

            // Handle new user registration with Google data
            if (type === "register" && data) {
                try {
                    const decodedData = JSON.parse(atob(data));
                    const { email, firstName, lastName } = decodedData;

                    // Redirect to signup page with pre-filled Google data
                    const params = new URLSearchParams();
                    if (email) params.set("email", email);
                    if (firstName) params.set("firstName", firstName);
                    if (lastName) params.set("lastName", lastName);
                    params.set("oauth", "google");

                    toast.success("Complete your registration to continue");
                    navigate(`/signup?${params.toString()}`);
                    return;
                } catch (err) {
                    console.error("Failed to decode Google data:", err);
                    toast.error("Failed to process Google sign-in data");
                    navigate("/login");
                    return;
                }
            }

            // If already authenticated, go to home
            if (isAuthenticated) {
                navigate("/");
                return;
            }

            // Unknown state, redirect to login
            toast.error("Authentication failed. Please try again.");
            navigate("/login");
        };

        handleCallback();

        // Set processing to false after a timeout to avoid infinite loading
        const timeout = setTimeout(() => setProcessing(false), 5000);
        return () => clearTimeout(timeout);
    }, [searchParams, navigate, isAuthenticated]);

    // Helper function to get human-readable error messages
    const getErrorMessage = (error: string): string => {
        const errorMessages: Record<string, string> = {
            google_failed: "Google authentication failed. Please try again.",
            no_data: "No user data received from Google. Please try again.",
            access_denied: "Access was denied. Please grant permission to continue.",
        };
        return errorMessages[error] || "Authentication failed. Please try again.";
    };

    if (processing) {
        return <LoadingModal />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Processing...</h1>
                <p className="text-gray-600">Please wait while we complete your sign-in.</p>
            </div>
        </div>
    );
}
