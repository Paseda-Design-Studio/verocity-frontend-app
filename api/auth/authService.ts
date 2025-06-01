import { useAuthRepository } from "./authRepository";
import type {
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  IndividualRegisterRequest,
  BusinessRegisterRequest,
  RegisterResponseData,
  VerifyEmailRequest,
  VerifyEmailResponseData,
  VerifyOtpRequest,
  VerifyOtpResponseData,
  WhoAmIResponseData,
  UpdatePasswordRequest,
  UpdatePasswordResponseData,
  UploadProfilePictureRequest,
  UploadProfilePictureResponseData,
} from "./types";

export function useAuthService() {
  const authRepository = useAuthRepository();

  /**
   * Validates login credentials before sending to API
   */
  const validateLoginCredentials = (credentials: LoginRequest): boolean => {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email and password are required");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error("Please enter a valid email address");
    }

    return true;
  };

  /**
   * Validates registration data before sending to API
   */
  const validateRegistration = (data: RegisterRequest): boolean => {
    if (!data.email || !data.password) {
      throw new Error("Email and password are required");
    }

    if (!data.phone) {
      throw new Error("Phone number is required");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Please enter a valid email address");
    }

    // Password strength validation
    if (data.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Customer type specific validations
    if (data.customer_type === "individual") {
      const individualData = data as IndividualRegisterRequest;
      if (!individualData.firstname || !individualData.lastname) {
        throw new Error("First name and last name are required");
      }
    } else if (data.customer_type === "business") {
      const businessData = data as BusinessRegisterRequest;
      if (!businessData.business_name) {
        throw new Error("Business name is required");
      }
    }

    return true;
  };

  /**
   * Login with validation - returns message about OTP being sent
   */
  const login = async (
    credentials: LoginRequest
  ): Promise<LoginResponseData> => {
    validateLoginCredentials(credentials);
    return await authRepository.login(credentials);
  };

  /**
   * Verify OTP and get JWT token
   */
  const verifyOtp = async (
    email: string,
    otp: string
  ): Promise<VerifyOtpResponseData> => {
    if (!otp || !email) {
      throw new Error("OTP and email are required");
    }

    const verifyData: VerifyOtpRequest = {
      email,
      otp,
    };

    return await authRepository.verifyOtp(verifyData);
  };

  /**
   * Get current user information using JWT token
   */
  const whoAmI = async (): Promise<WhoAmIResponseData> => {
    return await authRepository.whoami();
  };

  /**
   * Register a user (individual or business) with validation
   */
  const register = async (
    data: RegisterRequest
  ): Promise<RegisterResponseData> => {
    validateRegistration(data);

    if (data.customer_type === "individual") {
      return await authRepository.register(data as IndividualRegisterRequest);
    } else {
      return await authRepository.register(data as BusinessRegisterRequest);
    }
  };

  /**
   * Verify email with token
   */
  const verifyEmail = async (
    token: string
  ): Promise<VerifyEmailResponseData> => {
    if (!token) {
      throw new Error("Verification token is required");
    }
    // Create a VerifyEmailRequest object
    const verifyData: VerifyEmailRequest = {
      token,
    };
    return await authRepository.verifyEmail(verifyData);
  };

  /**
   * Logout
   */
  const logout = async (): Promise<void> => {
    return await authRepository.logout();
  };

  /**
   * Refresh the authentication token
   */
  const refreshToken = async (
    refreshToken: string
  ): Promise<{ token: string }> => {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    return await authRepository.refreshToken(refreshToken);
  };

  /**
   * Resend verification email
   */

  const resendVerificationEmail = async (
    email: string
  ): Promise<{ message: string }> => {
    if (!email) {
      throw new Error("Email is required");
    }

    return await authRepository.resendVerificationEmail(email);
  };

  /**
   * Update user password
   */
  const updatePassword = async (
    data: UpdatePasswordRequest
  ): Promise<UpdatePasswordResponseData> => {
    if (!data.current_password || !data.new_password) {
      throw new Error("Current password and new password are required");
    }

    return await authRepository.updatePasword(data);
  };

  /**
   * Upload profile picture
   */
  const uploadProfilePicture = async (
    profilePicture: File
  ): Promise<UploadProfilePictureResponseData> => {
    if (!profilePicture) {
      throw new Error("Profile picture is required");
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(profilePicture.type)) {
      throw new Error(
        "Please upload a valid image file (JPEG, PNG, GIF, or WebP)"
      );
    }

    // Validate file size (2MB to match backend)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (profilePicture.size > maxSize) {
      throw new Error("Profile picture must be less than 2MB");
    }

    const uploadData: UploadProfilePictureRequest = {
      profilePicture,
    };

    return await authRepository.uploadProfilePicture(uploadData);
  };

  /**
   * update a user's details
   */
  const updateUserDetails = async (
    userDetails: Partial<RegisterRequest>
  ): Promise<RegisterResponseData> => {
    return await authRepository.updateUser(userDetails);
  };

  return {
    login,
    verifyOtp,
    whoAmI,
    register,
    verifyEmail,
    logout,
    refreshToken,
    resendVerificationEmail,
    updatePassword,
    uploadProfilePicture,
    updateUserDetails,
  };
}
