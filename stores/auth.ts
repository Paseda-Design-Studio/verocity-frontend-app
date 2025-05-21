import { defineStore } from "pinia";
import { useAuthService } from "~/api/auth/authService";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  VerifyOtpResponse,
} from "~/api/auth/types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
    otpEmail: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userFullName: (state) => {
      if (!state.user) return "";

      if (state.user.customerType === "business") {
        return state.user.businessName || "";
      } else {
        return `${state.user.firstName || ""} ${
          state.user.lastName || ""
        }`.trim();
      }
    },
    userRole: (state) => state.user?.role || null,
    isAdmin: (state) =>
      state.user?.role === "admin" || state.user?.role === "superadmin",
    isSuperAdmin: (state) => state.user?.role === "superadmin",
    isCustomer: (state) => state.user?.role === "customer",
    isActivated: (state) => state.user?.activated || false,
  },

  actions: {
    initAuth() {
      if (import.meta.client) {
        const storedToken = localStorage.getItem("auth_token");

        if (storedToken) {
          this.token = storedToken;
          // Fetch user data if we have a token but no user
          if (!this.user) {
            this.fetchUserData();
          }
        }
      }
    },

    setToken(token: string) {
      this.token = token;

      if (import.meta.client) {
        localStorage.setItem("auth_token", token);
      }
    },

    setUser(user: User) {
      this.user = user;
    },

    clearAuthData() {
      this.user = null;
      this.token = null;
      this.otpEmail = null;

      if (import.meta.client) {
        localStorage.removeItem("auth_token");
      }
    },

    async fetchUserData() {
      if (!this.token) return;

      const authService = useAuthService();
      this.loading = true;

      try {
        const response = await authService.whoAmI();
        this.user = response.data.user;
      } catch (err: any) {
        this.error = err.message || "Failed to fetch user data";
        // If we can't fetch user data, the token might be invalid
        this.clearAuthData();
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async login(credentials: LoginRequest) {
      const authService = useAuthService();
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.login(credentials);
        // Store email for OTP verification
        this.otpEmail = credentials.email;
        return response;
      } catch (err: any) {
        this.error = err.message || "Login failed";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async verifyOtp(otp: string) {
      const authService = useAuthService();
      this.loading = true;
      this.error = null;

      if (!this.otpEmail) {
        this.error = "OTP session expired. Please login again.";
        throw new Error(this.error);
      }

      try {
        const response = await authService.verifyOtp(this.otpEmail, otp);
        this.setToken(response.token);
        await this.fetchUserData(); // Fetch user data after getting token
        return response;
      } catch (err: any) {
        this.error = err.message || "OTP verification failed";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async register(userData: RegisterRequest) {
      const authService = useAuthService();
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.register(userData);
        return response;
      } catch (err: any) {
        this.error = err.message || "Registration failed";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async verifyEmail(token: string) {
      const authService = useAuthService();
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.verifyEmail(token);
        console.log("Email verification response:", response);
        return response;
      } catch (err: any) {
        console.error("Email verification error from store:", err.message);
        this.error = err.message || "Email verification failed";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      const authService = useAuthService();
      this.loading = true;

      try {
        if (this.token) {
          await authService.logout();
        }
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        this.clearAuthData();
        this.loading = false;
      }
    },
  },
});
