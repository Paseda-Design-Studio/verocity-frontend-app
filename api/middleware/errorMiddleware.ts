export default function useErrorMiddleware() {
  return {
    onResponseError: (error: any) => {
      // Extract error message from response
      let errorMessage = 'An unexpected error occurred';
      
      if (error.response?._data?.message) {
        errorMessage = error.response._data.message;
      } else if (error.response?._data?.error) {
        errorMessage = error.response._data.error;  // This is capturing "User is already activated"
      } else if (error.response?._data?.data?.message) {
        errorMessage = error.response._data.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }      
      
      // Log the error
      console.error('API Error:', errorMessage, error);
      console.error('API Error Details:', error.response._data.error);
      
      // Return a standardized error object
      return Promise.reject({
        message: errorMessage,
        status: error.response?.status || 500,
        originalError: error.response || error,
      });
    }
  };
}