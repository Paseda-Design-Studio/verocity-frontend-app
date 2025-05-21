import { useApiClient } from '../core/apiClient';
import type { 
  LoginRequest, 
  LoginResponse,
  RegisterRequest, 
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  WhoAmIResponse
} from './types';

export function useAuthRepository() {
  const apiClient = useApiClient();
  
  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    return await apiClient.post<LoginResponse>('/auth/login', credentials);
  };
  
  const verifyOtp = async (verifyData: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    return await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', verifyData);
  };
  
  const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
    return await apiClient.post<RegisterResponse>('/auth/register', userData);
  };
  
  const verifyEmail = async (verifyData: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    return await apiClient.patch<VerifyEmailResponse>('/auth/verify-user', verifyData);
  };
  
  const whoami = async (): Promise<WhoAmIResponse> => {
    return await apiClient.get<WhoAmIResponse>('/auth/whoami');
  };
  
  const logout = async (): Promise<void> => {
    await apiClient.post<void>('/auth/logout');
  };
  
  const refreshToken = async (refreshToken: string): Promise<{ token: string }> => {
    return await apiClient.post<{ token: string }>('/auth/refresh', { refreshToken });
  };
  
  
  const resendVerificationEmail = async (email: string): Promise<{ message: string }> => {
    return await apiClient.post<{ message: string }>('/auth/send-activation-token', { email });
  }
  
  return {
    login,
    verifyOtp,
    register,
    verifyEmail,
    whoami,
    logout,
    refreshToken,
    resendVerificationEmail
  };
}
