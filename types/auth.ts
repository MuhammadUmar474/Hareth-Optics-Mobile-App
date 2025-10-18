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

export interface RefreshTokenResponse {
  customerAccessToken: {
    accessToken: string;
    expiresAt: string;
  } | null;
  userErrors: {
    field: string;
    message: string;
  }[];
}

export interface CustomerDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDetailsResponse {
  customer: CustomerDetails | null;
}

export interface ForgotPasswordResponse {
  customerUserErrors: {
    field: string;
    message: string;
  }[];
}

export interface LogoutResponse {
  deletedAccessToken: string | null;
  deletedCustomerAccessTokenId: string | null;
  userErrors: {
    field: string;
    message: string;
  }[];
}

export interface CustomerUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface CustomerUpdateResponse {
  data: {
    customerUpdate: {
      customer: CustomerDetails | null;
      customerAccessToken: {
        accessToken: string;
        expiresAt: string;
      } | null;
      customerUserErrors: {
        field: string[];
        message: string;
      }[];
    };
  };
  errors?: {
    message: string;
    locations?: {
      line: number;
      column: number;
    }[];
    path?: string[];
  }[];
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
