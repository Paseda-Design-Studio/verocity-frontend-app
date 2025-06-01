import useAuthMiddleware from "../middleware/authMiddleware";
import useErrorMiddleware from "../middleware/errorMiddleware";
import useLoggerMiddleware from "../middleware/loggerMiddleware";
import type { ApiResponse } from "./types";

export function useApiClient() {
  const config = useRuntimeConfig();

  // Initialize middleware
  const authMiddleware = useAuthMiddleware();
  const errorMiddleware = useErrorMiddleware();
  const loggerMiddleware = useLoggerMiddleware();

  // Base options for all requests
  const getBaseOptions = (data?: any) => {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    // Only set Content-Type to application/json if data is not FormData
    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    return {
      baseURL: config.public.baseURL,
      headers,
      timeout: 30000, // 30 seconds
    };
  };

  // Apply request middleware
  const applyRequestMiddleware = (options: any) => {
    let config = { ...options };

    // Apply middleware in order
    config = loggerMiddleware.onRequest(config);
    config = authMiddleware.onRequest(config);

    return config;
  };

  // Handle response with middleware
  const handleResponse = async <T>(response: any): Promise<T> => {
    console.log("Raw Response:", JSON.stringify(response, null, 2));

    // Check for the expected structure
    if (response._data) {
      const apiResponse = response._data as ApiResponse<T>;

      if (apiResponse.status && apiResponse.data !== undefined) {
        console.log("API Response Data:", apiResponse.data);
        return apiResponse.data;
      }
    } else if (response.data) {
      console.log("API Response Data (legacy):", JSON.stringify(response.data, null, 2));
      return response.data as T;
    } else {
      console.warn("Unexpected response structure:", JSON.stringify(response, null, 2));
      return response as T;
    }

    // Fallback for empty responses
    console.warn("Empty response received");
    return {} as T;
  };

  // Handle errors with middleware
  const handleError = async (error: any): Promise<never> => {
    // Apply error middleware in reverse order
    let processedError = error;

    try {
      processedError = await authMiddleware.onResponseError(processedError);
    } catch (e) {
      processedError = e;
    }

    try {
      processedError = await errorMiddleware.onResponseError(processedError);
    } catch (e) {
      processedError = e;
    }

    try {
      processedError = await loggerMiddleware.onResponseError(processedError);
    } catch (e) {
      processedError = e;
    }
    throw processedError;
  };

  // Generic request method
  const request = async <T>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    data?: any,
    options?: any
  ): Promise<T> => {
    const baseOptions = getBaseOptions(data);

    const fetchOptions = {
      ...baseOptions,
      ...options,
      method: method, // Ensure method is uppercase
      body: method !== "GET" ? data : undefined,
      params: method === "GET" ? data : undefined,
    };

    // If options contain headers, merge them properly
    if (options?.headers) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        ...options.headers,
      };
    }

    // Apply middleware
    const processedOptions = applyRequestMiddleware(fetchOptions);

    try {
      // Use $fetch with the processed options
      const response = await $fetch(url, processedOptions);
      console.log("Response from $fetch:", JSON.stringify(response, null, 2));
      return handleResponse<T>(response);
    } catch (error) {
      return handleError(error);
    }
  };

  // Convenience methods
  const get = <T>(url: string, params?: any, options?: any) => {
    return request<T>(url, "GET", params, options);
  };

  const post = <T>(url: string, data?: any, options?: any) => {
    return request<T>(url, "POST", data, options);
  };

  const put = <T>(url: string, data?: any, options?: any) => {
    return request<T>(url, "PUT", data, options);
  };

  const del = <T>(url: string, options?: any) => {
    return request<T>(url, "DELETE", undefined, options);
  };

  const patch = <T>(url: string, data?: any, options?: any) => {
    return request<T>(url, "PATCH", data, options);
  };

  return {
    get,
    post,
    put,
    del,
    patch,
  };
}
