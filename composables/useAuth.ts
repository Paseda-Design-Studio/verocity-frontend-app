import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import type { 
  LoginRequest, 
  RegisterRequest,
} from '~/api/auth/types';

export function useAuth() {
  const authStore = useAuthStore();
  
  // Initialize auth state
  if (import.meta.client) {
    authStore.initAuth();
  }
  
  return {
    // State
    user: computed(() => authStore.user),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),
    token: computed(() => authStore.token),
    
    // Computed
    isAuthenticated: computed(() => authStore.isAuthenticated),
    userFullName: computed(() => authStore.userFullName),
    userRole: computed(() => authStore.userRole),
    isAdmin: computed(() => authStore.isAdmin),
    isSuperAdmin: computed(() => authStore.isSuperAdmin),
    isCustomer: computed(() => authStore.isCustomer),
    isActivated: computed(() => authStore.isActivated),
    
    // Methods - wrap these to preserve the store context
    login: (credentials: LoginRequest) => authStore.login(credentials),
    verifyOtp: (otp: string) => authStore.verifyOtp(otp),
    register: (userData: RegisterRequest) => authStore.register(userData),
    verifyEmail: (token: string) => authStore.verifyEmail(token),
    logout: () => authStore.logout(),
    initAuth: () => authStore.initAuth(),
    fetchUserData: () => authStore.fetchUserData(),
  };
}
