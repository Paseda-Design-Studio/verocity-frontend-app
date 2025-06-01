import type { FetchError } from "ofetch";
import type { ApiError } from "./types";

export function handleApiError(error: unknown) {
  // Type guard to check if it's a FetchError
  const isFetchError = (err: any): err is FetchError => {
    return err && typeof err === "object" && "response" in err;
  };

  // If it's not a FetchError, handle it generically
  if (!isFetchError(error)) {
    console.error("Unknown error:", error);
    return Promise.reject({
      message: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
      status: 0,
    });
  }

  // Now we can safely use error as FetchError
  const response = error.response;
  const status = error.status || 0;

  // Handle different error scenarios
  if (!response) {
    // Network error or no response from server
    console.error("Network error or server not responding");

    if (import.meta.client) {
      // Only navigate on client-side
      const router = useRouter();

      // Show network error page or notification
      // router.push('/error/network');
    }

    return Promise.reject({
      message: "Network error or server not responding",
      code: "NETWORK_ERROR",
      status: 0,
    });
  }

  // Handle specific HTTP status codes
  switch (status) {
    case 401: // Unauthorized
      if (import.meta.client) {
        // Clear auth data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");

        // Redirect to login
        const router = useRouter();
        router.push("/auth/login");
      }
      break;

    case 403: // Forbidden
      console.error("Access forbidden:", response._data);
      break;

    case 404: // Not found
      console.error("Resource not found:", response._data);
      break;

    case 422: // Validation error
      console.error("Validation error:", response._data);
      break;

    case 500: // Server error
    case 502: // Bad gateway
    case 503: // Service unavailable
      console.error("Server error:", response._data);
      break;

    default:
      console.error(`Error (${status}):`, response._data);
  }

  // Return a rejected promise with the error data
  return Promise.reject({
    message: response._data?.message || "An unexpected error occurred",
    code: response._data?.code || `ERROR_${status}`,
    status: status,
    details: response._data?.details,
  });
}
// Utility function to extract error message for display
export function getErrorMessage(error: any): string {
  if (!error) return "An unknown error occurred";

  // If it's a fetch error with the new response structure
  if (
    error.response?._data?.status === "error" &&
    error.response?._data?.data?.error
  ) {
    return error.response._data.data.error;
  }

  // If it's a fetch error with response data (old structure)
  if (error.response?._data?.message) {
    return error.response._data.message;
  }

  // If it's our standardized error format
  if (error.message) {
    return error.message;
  }

  // Fallback to generic message
  return "An unexpected error occurred";
}
