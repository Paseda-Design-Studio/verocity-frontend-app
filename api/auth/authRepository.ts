import { useApiClient } from "../core/apiClient";
import type {
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  RegisterResponseData,
  VerifyOtpRequest,
  VerifyOtpResponseData,
  VerifyEmailRequest,
  VerifyEmailResponseData,
  WhoAmIResponseData,
  UpdatePasswordRequest,
  UpdatePasswordResponseData,
  UploadProfilePictureRequest,
  UploadProfilePictureResponseData,
} from "./types";

export function useAuthRepository() {
  const apiClient = useApiClient();

  const login = async (
    credentials: LoginRequest
  ): Promise<LoginResponseData> => {
    const response = await apiClient.post<LoginResponseData>(
      "/auth/login",
      credentials
    );

    console.log("Login response from repo:", response);

    // The apiClient already extracts the data, so response is directly the data
    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }

    return response;
  };

  const verifyOtp = async (
    verifyData: VerifyOtpRequest
  ): Promise<VerifyOtpResponseData> => {
    const response = await apiClient.post<VerifyOtpResponseData>(
      "/auth/verify-otp",
      verifyData
    );

    console.log("VerifyOtp response from repo:", response);

    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }

    return response;
  };

  const register = async (
    userData: RegisterRequest
  ): Promise<RegisterResponseData> => {
    const response = await apiClient.post<RegisterResponseData>(
      "/auth/register",
      userData
    );

    console.log("Register response from repo:", response);

    // The apiClient already extracts the data, so response is directly the data
    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }

    return response;
  };

  const verifyEmail = async (
    verifyData: VerifyEmailRequest
  ): Promise<VerifyEmailResponseData> => {
    const response = await apiClient.patch<VerifyEmailResponseData>(
      "/auth/verify-user",
      verifyData
    );

    console.log("VerifyEmail response from repo:", response);

    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }

    return response;
  };

  const whoami = async (): Promise<WhoAmIResponseData> => {
    const response = await apiClient.get<WhoAmIResponseData>("/auth/whoami");

    console.log("WhoAmI response from repo:", response);

    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }

    return response;
  };

  const logout = async (): Promise<void> => {
    await apiClient.post<void>("/auth/logout");
  };

  const refreshToken = async (
    refreshToken: string
  ): Promise<{ token: string }> => {
    const response = await apiClient.post<{ token: string }>("/auth/refresh", {
      refreshToken,
    });

    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }

    return response;
  };

  const resendVerificationEmail = async (
    email: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      "/auth/send-activation-token",
      { email }
    );

    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }

    return response;
  };

  const updatePasword = async (
    updatepasswordData: UpdatePasswordRequest
  ): Promise<UpdatePasswordResponseData> => {
    const response = await apiClient.post<UpdatePasswordResponseData>(
      "/auth/password/update",
      updatepasswordData
    );

    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }
    return response;
  };

  const uploadProfilePicture = async (
    uploadProfilePictureData: UploadProfilePictureRequest
  ): Promise<UploadProfilePictureResponseData> => {
    // Create FormData for file upload
    const formData = new FormData();

    formData.append("profile_picture", uploadProfilePictureData.profilePicture);

   

    const response = await apiClient.post<UploadProfilePictureResponseData>(
      "/auth/profile/upload",
      formData
    );

    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }

    return response;
  };
  
  const updateUser = async (
    userData: Partial<RegisterRequest>
  ): Promise<RegisterResponseData> => {
    const response = await apiClient.patch<RegisterResponseData>(
      "/auth/profile/update",
      userData
    );

    console.log("UpdateUser response from repo:", response);

    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }

    return response;
  }
  

  return {
    login,
    verifyOtp,
    register,
    verifyEmail,
    whoami,
    logout,
    refreshToken,
    resendVerificationEmail,
    updatePasword,
    uploadProfilePicture,
    updateUser,
  };
}
