export default function useLoggerMiddleware() {
    return {
      onRequest: (config: any) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`);
          
          // Log request headers and body for debugging (excluding sensitive data)
          const sanitizedConfig = { ...config };
          if (sanitizedConfig.headers?.Authorization) {
            sanitizedConfig.headers.Authorization = 'Bearer [REDACTED]';
          }
          
          if (sanitizedConfig.data && 
              (typeof sanitizedConfig.data === 'object') && 
              sanitizedConfig.data.password) {
            sanitizedConfig.data = { ...sanitizedConfig.data, password: '[REDACTED]' };
          }
          
          console.log('Request Config:', sanitizedConfig);
        }
        return config;
      },
      
      onResponse: (response: any) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`✅ Response: ${response.status} ${response.config.url}`);
          
          // Log response data for debugging (excluding sensitive data)
          const sanitizedData = { ...response.data };
          if (sanitizedData.token) {
            sanitizedData.token = '[REDACTED]';
          }
          
          console.log('Response Data:', sanitizedData);
        }
        return response;
      },
      
      onResponseError: (error: any) => {
        console.error(`❌ Error: ${error.response?.status || 'Network Error'} ${error.config?.url || ''}`);
        
        if (process.env.NODE_ENV !== 'production' && error.response?.data) {
          console.error('Error Response:', error.response.data);
        }
        
        return Promise.reject(error);
      }
    };
  }
  