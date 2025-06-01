export default function useErrorMiddleware() {
  return {
    onResponseError: (error: any) => {
      // Extract error message from response
      let errorMessage = 'An unexpected error occurred';
      
      // Check for the new error structure first
      if (error.response?._data?.status === 'error' && error.response?._data?.data?.error) {
        errorMessage = error.response._data.data.error;
      }
      // Fallbacks for other error structures
      else if (error.response?._data?.message) {
        errorMessage = error.response._data.message;
      } else if (error.response?._data?.error) {
        errorMessage = error.response._data.error;
      } else if (error.response?._data?.data?.message) {
        errorMessage = error.response._data.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Log the error
      console.error('API Error:', errorMessage, error);
      
      // Return a standardized error object
      return Promise.reject({
        message: errorMessage,
        status: error.response?.status || 500,
        originalError: error.response || error,
      });
    }
  };
}
