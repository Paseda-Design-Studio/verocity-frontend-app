import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  
  // Initialize auth state if not already done
  if (import.meta.client && !authStore.user && !authStore.loading) {
    authStore.initAuth();
  }
  
  // If not authenticated and not going to auth pages, redirect to login
  if (!authStore.isAuthenticated) {
    // Allow access to public routes
    const publicRoutes = [
      '/auth/login', 
      '/auth/register', 
      '/auth/email-verification',
      '/auth/login-verification'
    ];
    
    if (!publicRoutes.includes(to.path) && !to.path.startsWith('/auth/email-verification')) {
      return navigateTo('/auth/login');
    }
  }
  
  // Role-based access control
  if (authStore.isAuthenticated) {
    // Redirect from auth pages if already logged in
    if (to.path.startsWith('/auth/') && to.path !== '/auth/logout') {
      return navigateTo('/dashboard');
    }
    
    // Admin-only routes
    if (to.path.startsWith('/admin') && !authStore.isAdmin) {
      return navigateTo('/dashboard');
    }
    
    // Super admin only routes
    if (to.path.startsWith('/super-admin') && !authStore.isSuperAdmin) {
      return navigateTo('/dashboard');
    }
    
    // Check account activation status for certain routes
    const requiresActivation = ['/dashboard', '/profile', '/transactions'];
    if (requiresActivation.includes(to.path) && !authStore.isActivated) {
      return navigateTo('/auth/verify-email-notice');
    }
  }
});
