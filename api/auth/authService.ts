import { useAuthRepository } from './authRepository';
import type { 
  LoginRequest, 
  LoginResponse,
  RegisterRequest, 
  IndividualRegisterRequest, 
  BusinessRegisterRequest, 
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  WhoAmIResponse
} from './types';

export function useAuthService() {
  const authRepository = useAuthRepository();
  
  /**
   * Validates login credentials before sending to API
   */
  const validateLoginCredentials = (credentials: LoginRequest): boolean => {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error('Please enter a valid email address');
    }
    
    return true;
  };
  
  /**
   * Validates registration data before sending to API
   */
  const validateRegistration = (data: RegisterRequest): boolean => {
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }
    
    if (!data.phone) {
      throw new Error('Phone number is required');
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // Password strength validation
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // Customer type specific validations
    if (data.customer_type === 'individual') {
      const individualData = data as IndividualRegisterRequest;
      if (!individualData.firstname || !individualData.lastname) {
        throw new Error('First name and last name are required');
      }
    } else if (data.customer_type === 'business') {
      const businessData = data as BusinessRegisterRequest;
      if (!businessData.business_name) {
        throw new Error('Business name is required');
      }
    }
    
    return true;
  };
  
  /**
   * Login with validation - returns message about OTP being sent
   */
  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    validateLoginCredentials(credentials);
    return await authRepository.login(credentials);
  };
  
  /**
   * Verify OTP and get JWT token
   */
  const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    if (!otp || !email) {
      throw new Error('OTP and email are required');
    }
    
    const verifyData: VerifyOtpRequest = {
      email,
      otp
    };
    
    return await authRepository.verifyOtp(verifyData);
  };
  
  /**
   * Get current user information using JWT token
   */
  const whoAmI = async (): Promise<WhoAmIResponse> => {
    return await authRepository.whoami();
  };
  
  /**
   * Register a user (individual or business) with validation
   */
  const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    validateRegistration(data);
    
    if (data.customer_type === 'individual') {
      return await authRepository.register(data as IndividualRegisterRequest);
    } else {
      return await authRepository.register(data as BusinessRegisterRequest);
    }
  };
  
  /**
   * Verify email with token
   */
  const verifyEmail = async (token: string): Promise<VerifyEmailResponse> => {
    if (!token) {
      throw new Error('Verification token is required');
    }
    // Create a VerifyEmailRequest object
    const verifyData: VerifyEmailRequest = {
      token
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
  const refreshToken = async (refreshToken: string): Promise<{ token: string }> => {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }
    
    return await authRepository.refreshToken(refreshToken);
  };
  
  /**
   * Resend verification email
   */
  
  const resendVerificationEmail = async (email: string): Promise<{ message: string }> => {
    if (!email) {
      throw new Error('Email is required');
    }
    
    return await authRepository.resendVerificationEmail(email);
  }
  
  return {
    login,
    verifyOtp,
    whoAmI,
    register,
    verifyEmail,
    logout,
    refreshToken,
    resendVerificationEmail
  };
}
