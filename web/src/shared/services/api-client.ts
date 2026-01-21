import { toast } from "sonner";

interface IApiClient {
  url: string;
  options: RequestInit;
  skipErrorToast?: boolean;
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create API client to avoid duplications
export const apiClient = async ({
  url,
  options = {},
  skipErrorToast = false,
}: IApiClient) => {
  const response = await fetch(`${API_BASE_URL}/api${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = (errorData.message as string) || "Something Went wrong";
    if (!skipErrorToast) {
      toast.error(errorMessage);
    }
    // Throw error with response data so it can be caught and handled properly
    const error: any = new Error(errorMessage);
    error.response = { data: errorData, status: response.status };
    throw error;
  }
  return response.json();
};

type IApiFormClient = IApiClient & { formData: FormData };
export const apiFormClient = async ({
  url,
  options = {},
  formData,
}: IApiFormClient) => {
  const response = await fetch(`${API_BASE_URL}/api${url}`, {
    ...options,

    method: options.method || "POST",
    body: formData,
    credentials: "include",
    headers: {
      ...options.headers,
    },
  });
  if (!response.ok) {
    let errorMessage = "Something went wrong, please try again";
    const errorData = await response.json();

    // Prefer custom message from backend
    if (errorData?.message) {
      errorMessage = errorData.message;
    } else if (errorData?.error?.message) {
      errorMessage = errorData.error.message;
    }
    toast.error(`${errorMessage}`);
    return false;
  }
  return response.json();
};
