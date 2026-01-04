type ApiClientTypes = {
  url: string;
  options: RequestInit;
};

const API_BASE_URL = "http://localhost:8080/api/v1";
export const apiClient = async ({ url, options = {} }: ApiClientTypes) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error((errorData.message as string) || "Something Went wrong");
  }
  return response.json(); // Promise of response data (JSON)
};
