// Auth-specific types
export interface User {
  activated: boolean;
  address: string | null;
  city: string | null;
  country: string | null;
  customerType: 'individual' | 'business' | null;
  email: string;
  refID: string;
  role: 'superadmin' | 'admin' | 'customer';
  state: string | null;
  zipCode: string | null;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  otpReference?: string;
}

// Base register request with common fields
interface BaseRegisterRequest {
  email: string;
  phone: string;
  password: string;
  customer_type: 'individual' | 'business';
}

// Individual registration request
export interface IndividualRegisterRequest extends BaseRegisterRequest {
  customer_type: 'individual';
  firstname: string;
  lastname: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
}

// Business registration request
export interface BusinessRegisterRequest extends BaseRegisterRequest {
  customer_type: 'business';
  business_name: string;
}

// Union type for all registration requests
export type RegisterRequest = IndividualRegisterRequest | BusinessRegisterRequest;

export interface RegisterResponse {
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  otpReference?: string;
}

export interface VerifyOtpResponse {
  message: string;
  token: string;
  refreshToken?: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
  success: boolean;
}

export interface WhoAmIResponse {
  data: {
    message: string;
    user: User;
  }
}
