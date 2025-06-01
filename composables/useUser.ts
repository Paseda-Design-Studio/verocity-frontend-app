import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

export function useUser() {
  const authStore = useAuthStore();
  
  return {
    // User data
    user: computed(() => authStore.user),
    
    // User properties
    refID: computed(() => authStore.user?.refID),
    email: computed(() => authStore.user?.email),
    role: computed(() => authStore.user?.role),
    customerType: computed(() => authStore.user?.customerType),
    
    // Address information
    address: computed(() => authStore.user?.address),
    city: computed(() => authStore.user?.city),
    state: computed(() => authStore.user?.state),
    country: computed(() => authStore.user?.country),
    zipCode: computed(() => authStore.user?.zipCode),
    
    // User status
    isActivated: computed(() => authStore.user?.activated),
    
    // User type helpers
    isIndividual: computed(() => authStore.user?.customerType === 'individual'),
    isBusiness: computed(() => authStore.user?.customerType === 'business'),
    isAdmin: computed(() => authStore.isAdmin),
    isSuperAdmin: computed(() => authStore.isSuperAdmin),
    isCustomer: computed(() => authStore.isCustomer),
    
    // User name helpers
    fullName: computed(() => authStore.userFullName),
    userInitial: computed(() => authStore.userInitial),
  };
}
