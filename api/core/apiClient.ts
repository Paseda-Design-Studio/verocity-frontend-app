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
  const getBaseOptions = () => {
    return {
      baseURL: config.public.baseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
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
    // Apply response middleware
    const processedResponse = loggerMiddleware.onResponse(response);

    // Extract the data from the API response
    const apiResponse = processedResponse._data as ApiResponse<T>;
    console.log("API Response:", apiResponse.data);

    return apiResponse.data;
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
    const baseOptions = getBaseOptions();

    const fetchOptions = {
      ...baseOptions,
      ...options,
      method: method, // Ensure method is uppercase
      body: method !== "GET" ? data : undefined,
      params: method === "GET" ? data : undefined,
    };

    // Apply middleware
    const processedOptions = applyRequestMiddleware(fetchOptions);

    try {
      // Use $fetch with the processed options
      const response = await $fetch(url, processedOptions);
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
