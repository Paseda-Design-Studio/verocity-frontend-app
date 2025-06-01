export default function useLoggerMiddleware() {
  return {
    onRequest: (config: any) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(
          `🚀 Request: ${config.method?.toUpperCase()} ${config.url}`
        );

        // Log request headers and body for debugging (excluding sensitive data)
        const sanitizedConfig = { ...config };
        if (sanitizedConfig.headers?.Authorization) {
          sanitizedConfig.headers.Authorization = "Bearer [REDACTED]";
        }

        if (
          sanitizedConfig.data &&
          typeof sanitizedConfig.data === "object" &&
          sanitizedConfig.data.password
        ) {
          sanitizedConfig.data = {
            ...sanitizedConfig.data,
            password: "[REDACTED]",
          };
        }

        console.log("Request Config:", sanitizedConfig);
      }
      return config;
    },

    onResponse: (response: any) => {
      if (process.env.NODE_ENV !== "production") {
        console.log("Full Response:", JSON.stringify(response, null, 2));
    
        // Extract response data
        let responseData = response._data || response.data || response;
    
        // Log sanitized response data
        let sanitizedData = { ...responseData };
    
        // Redact sensitive information
        if (typeof sanitizedData === "object" && sanitizedData !== null) {
          if (sanitizedData.token) {
            sanitizedData.token = "[REDACTED]";
          }
          if (sanitizedData.data?.token) {
            sanitizedData.data.token = "[REDACTED]";
          }
        }
    
        console.log("Sanitized Response Data:", sanitizedData);
      }
    
      return response;
    },

    onResponseError: (error: any) => {
      console.error(
        `❌ Error: ${error.response?.status || "Network Error"} ${
          error.config?.url || ""
        }`
      );

      if (process.env.NODE_ENV !== "production") {
        if (error.response?._data) {
          console.error("Error Response Data:", error.response._data);
        } else if (error.response?.data) {
          console.error("Error Response Data:", error.response.data);
        } else {
          console.error("Error:", error);
        }
      }

      return Promise.reject(error);
    },
  };
}
