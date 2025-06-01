import { defineStore } from "pinia";
import { useAuthService } from "~/api/auth/authService";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  LoginResponseData,
  VerifyOtpResponseData,
  UpdatePasswordRequest,
  UpdatePasswordResponseData,
  UploadProfilePictureRequest,
  UploadProfilePictureResponseData,
} from "~/api/auth/types";

// Helper function to map API user response to User type
const mapApiUserToUser = (apiUser: any): User => {
  //log the apiUser to see its structure
  // console.log("Mapping API user to User type:", apiUser);

  return {
    activated: apiUser.activated,
    address: apiUser.address,
    city: apiUser.city,
    country: apiUser.country,
    customerType: apiUser.customerType,
    email: apiUser.email,
    refID: apiUser.refID,
    role: apiUser.role,
    state: apiUser.state,
    zipCode: apiUser.zipCode,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    name: apiUser.name,
    businessName: apiUser.businessName,
    phone: apiUser.phone,
    photoUrl: apiUser.photoURL,
    photoRef: apiUser.photoRef,
  };
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
    otpEmail: null as string | null,
    passwordUopdateLoading: false,
    profilePictureUploadLoading: false,
    profileUpdateLoading: false,
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

    // Get the user initial for display purposes
    userInitial: (state) => {
      if (!state.user) return "";

      if (state.user.customerType === "business") {
        const businessName = state.user.businessName || "";
        return businessName
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .slice(0, 2)
          .join("");
      } else {
        const firstName = state.user.firstName || "";
        const lastName = state.user.lastName || "";

        let initials = "";
        if (firstName) initials += firstName.charAt(0).toUpperCase();
        if (lastName) initials += lastName.charAt(0).toUpperCase();

        return initials || "GU";
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
        //console.log("WhoAmI response in store:", response);

        // Map the API user data to our User interface
        this.user = mapApiUserToUser(response.user);
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
        //console.log("Login response in store:", response);

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
        //console.log("OTP verification response in store:", response);

        this.setToken(response.token);

        await this.fetchUserData();

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
        // console.log("Registration response in store:", response);

        // Note: We don't set the user here because they need to verify their email first
        // The user will be activated after email verification

        return response;
      } catch (err: any) {
        console.error("Registration error from store:", err.message);
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
        //console.log("Email verification response in store:", response);

        // Map the API user data to our User interface
        if (response.user) {
          this.user = mapApiUserToUser(response.user);
        }

        return response;
      } catch (err: any) {
        console.error("Email verification error from store:", err.message);
        this.error = err.message || "Email verification failed";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updatePassword(passwordData: UpdatePasswordRequest) {
      const authService = useAuthService();
      this.passwordUopdateLoading = true;
      this.error = null;

      try {
        const response = await authService.updatePassword(passwordData);
        //console.log("Password update response in store:", response);

        return response;
      } catch (err: any) {
        console.error("Password update error from store:", err.message);
        this.error = err.message || "Password update failed";
        throw err;
      } finally {
        this.passwordUopdateLoading = false;
      }
    },

    async uploadProfilePicture(profilePictureData: File) {
      const authService = useAuthService();
      this.profilePictureUploadLoading = true;
      this.error = null;

      try {
        const response = await authService.uploadProfilePicture(
          profilePictureData
        );
        //console.log("Profile picture upload response in store:", response);

        // After successful upload, refresh user data to get updated profile picture
        if (response.uploadUrl || response.publicId) {
          await this.fetchUserData();
        }

        return response;
      } catch (err: any) {
        console.error("Profile picture upload error from store:", err.message);
        this.error = err.message || "Profile picture upload failed";
        throw err;
      } finally {
        this.profilePictureUploadLoading = false;
      }
    },
    
    async updateUserProfile(userData: Partial<User>) {
      const authService = useAuthService();
      this.profileUpdateLoading = true;
      this.error = null;
      try {
        const response = await authService.updateUserDetails(userData);
        //console.log("Update user profile response in store:", response);

        if (response.user) {
          await this.fetchUserData()
        }
        
        return response;
      } catch (err: any) {
        console.error("Update user profile error from store:", err.message);
        this.error = err.message || "Update user profile failed";
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
  persist: true,
});
