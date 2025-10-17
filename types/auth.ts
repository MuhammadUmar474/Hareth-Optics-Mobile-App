// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginFormValues {
  email?: string;
  password: string;
  phone?: string;
  whatsapp?: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  acceptsMarketing?: boolean;
}

export interface SignupFormValues {
  fullName: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  password: string;
}

export type AuthMode = "email" | "phone" | "whatsapp";

export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface LoginResponse {
  customerAccessToken: CustomerAccessToken | null;
  customerUserErrors: {
    field: string;
    message: string;
  }[];
}

export interface SignupResponse {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    acceptsMarketing: boolean;
  } | null;
  customerUserErrors: {
    field: string;
    message: string;
    code: string;
  }[];
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  expiresAt: string | null;
  user: {
    email: string;
  } | null;
  loading: boolean;
  error: string | null;
}

export interface AuthApiResponse<T> {
  data: T;
  errors?: {
    message: string;
    locations?: {
      line: number;
      column: number;
    }[];
    path?: string[];
  }[];
}
