import { useAuthStore } from '~/stores/auth';
import { navigateTo } from '#app';  

export default function useAuthMiddleware() {
  const authStore = useAuthStore();
  
  return {
    onRequest: (config: any) => {
      // Add auth token to requests if available
      if (authStore.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }
      return config;
    },
    
    onResponseError: async (error: any) => {
      // Handle 401 Unauthorized errors (token expired)
      if (error.response?.status === 401) {
        // If token is invalid, clear auth data and redirect to login
        authStore.clearAuthData();
        
        if (import.meta.client) {
          // Use Nuxt's navigateTo if in client context
          navigateTo('/auth/login');
        }
      }
      return Promise.reject(error);
    }
  };
}
