import { SHOPIFY_CONFIG, SHOPIFY_HEADERS } from '../../constants/shopify';
import { AuthApiResponse, CustomerDetailsResponse, CustomerUpdateInput, CustomerUpdateResponse, ForgotPasswordResponse, LoginCredentials, LoginResponse, LogoutResponse, RefreshTokenResponse, SignupCredentials, SignupResponse } from '../../types/auth';

class AuthApi {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = SHOPIFY_CONFIG.GRAPHQL_ENDPOINT;
    this.headers = { ...SHOPIFY_HEADERS };
  }

  /**
   * Login customer with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {

    const mutation = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        email: credentials.email,
        password: credentials.password,
      },
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();

      const data: AuthApiResponse<{
        customerAccessTokenCreate: LoginResponse;
      }> = JSON.parse(responseText);


      if (data.errors && data.errors.length > 0) {
        throw new Error(
          data.errors.map(error => error.message).join(', ')
        );
      }

      const result = data.data.customerAccessTokenCreate;
      
      // Check for customer errors in the response
      if (result.customerUserErrors && result.customerUserErrors.length > 0) {
        const errorMessage = result.customerUserErrors
          .map(error => error.message)
          .join(', ');
        throw new Error(errorMessage);
      }

      // Check if access token is null
      if (!result.customerAccessToken) {
        throw new Error("Login failed. Please check your credentials.");
      }

      return result;
    } catch (error) {
      console.error("💥 Auth API: Error caught");
      console.error("🚨 Error type:", typeof error);
      console.error("🚨 Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("🚨 Full error:", error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed. Please try again.');
    }
  }

  /**
   * Create new customer account
   */
  async signup(credentials: SignupCredentials): Promise<SignupResponse> {
    const mutation = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            firstName
            lastName
            email
            phone
            acceptsMarketing
          }
          customerUserErrors {
            field
            message
            code
          }
        }
      }
    `;

    const variables = {
      input: {
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email,
        phone: credentials.phone,
        password: credentials.password,
        acceptsMarketing: credentials.acceptsMarketing || false,
      },
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      const data: AuthApiResponse<{
        customerCreate: SignupResponse;
      }> = JSON.parse(responseText);

      if (data.errors && data.errors.length > 0) {
        throw new Error(
          data.errors.map(error => error.message).join(', ')
        );
      }

      const result = data.data.customerCreate;
      
      if (result.customerUserErrors && result.customerUserErrors.length > 0) {
        const errorMessage = result.customerUserErrors
          .map(error => error.message)
          .join(', ');
        throw new Error(errorMessage);
      }

      if (!result.customer) {
        throw new Error("Signup failed. Please try again.");
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Signup failed. Please try again.');
    }
  }

  /**
   * Set authorization header for authenticated requests
   */
  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Logout customer by deleting access token
   */
  async logout(accessToken: string): Promise<LogoutResponse> {
   
    const mutation = `
      mutation customerAccessTokenDelete($customerAccessToken: String!) {
        customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
          deletedAccessToken
          deletedCustomerAccessTokenId
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      customerAccessToken: accessToken,
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      const data: AuthApiResponse<{
        customerAccessTokenDelete: LogoutResponse;
      }> = JSON.parse(responseText);

      if (data.errors && data.errors.length > 0) {
        throw new Error(
          data.errors.map(error => error.message).join(', ')
        );
      }

      const result = data.data.customerAccessTokenDelete;
      
      if (result.userErrors && result.userErrors.length > 0) {
        const errorMessage = result.userErrors
          .map(error => error.message)
          .join(', ');
        throw new Error(errorMessage);
      }

      return result;
    } catch (error) {
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Logout failed. Please try again.');
    }
  }

  /**
   * Refresh customer access token
   */
  async refreshToken(accessToken: string): Promise<RefreshTokenResponse> {

    const mutation = `
      mutation customerAccessTokenRenew($customerAccessToken: String!) {
        customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      customerAccessToken: accessToken,
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      const data: AuthApiResponse<{
        customerAccessTokenRenew: RefreshTokenResponse;
      }> = JSON.parse(responseText);

      if (data.errors && data.errors.length > 0) {
        throw new Error(
          data.errors.map(error => error.message).join(', ')
        );
      }

      const result = data.data.customerAccessTokenRenew;
      
      if (result.userErrors && result.userErrors.length > 0) {
        const errorMessage = result.userErrors
          .map(error => error.message)
          .join(', ');
        throw new Error(errorMessage);
      }

      if (!result.customerAccessToken) {
        throw new Error("Token refresh failed. Please login again.");
      }

      return result;
    } catch (error) {   
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Token refresh failed. Please login again.');
    }
  }

  /**
   * Send password reset email
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {

    const mutation = `
      mutation customerRecover($email: String!) {
        customerRecover(email: $email) {
          customerUserErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      email: email,
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      const data: AuthApiResponse<{
        customerRecover: ForgotPasswordResponse;
      }> = JSON.parse(responseText);

      if (data.errors && data.errors.length > 0) {
        throw new Error(
          data.errors.map(error => error.message).join(', ')
        );
      }

      const result = data.data.customerRecover;
      
      if (result.customerUserErrors && result.customerUserErrors.length > 0) {
        const errorMessage = result.customerUserErrors
          .map(error => error.message)
          .join(', ');
        console.error("❌ Auth API: Forgot password user errors:", result.customerUserErrors);
        throw new Error(errorMessage);
      }

      return result;
    } catch (error) {
      console.error("💥 Auth API: Forgot password error caught");
      console.error("🚨 Error type:", typeof error);
      console.error("🚨 Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("🚨 Full error:", error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Password reset failed. Please try again.');
    }
  }

  /**
   * Get customer details
   */
  async getCustomerDetails(accessToken: string): Promise<CustomerDetailsResponse> {
    const query = `
      query GetCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          firstName
          lastName
          email
          phone
          acceptsMarketing
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      customerAccessToken: accessToken,
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      const data: AuthApiResponse<CustomerDetailsResponse> = JSON.parse(responseText);

      if (data.errors && data.errors.length > 0) {
        throw new Error(
          data.errors.map(error => error.message).join(', ')
        );
      }

      return data.data;
    } catch (error) {
      console.error("💥 Auth API: Get customer details error caught");
      console.error("🚨 Error type:", typeof error);
      console.error("🚨 Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("🚨 Full error:", error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch customer details. Please try again.');
    }
  }

  /**
   * Remove authorization header
   */
  clearAuthToken() {
    delete this.headers['Authorization'];
  }

  /**
   * Update customer details
   */
  async updateCustomer(
    accessToken: string,
    customer: CustomerUpdateInput
  ): Promise<CustomerUpdateResponse> {
    
    const mutation = `
      mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
          customer {
            id
            firstName
            lastName
            email
            phone
            acceptsMarketing
            createdAt
            updatedAt
          }
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      customerAccessToken: accessToken,
      customer,
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      const data: AuthApiResponse<{
        customerUpdate: CustomerUpdateResponse['data']['customerUpdate'];
      }> = JSON.parse(responseText);

      if (data.errors && data.errors.length > 0) {
        throw new Error(
          data.errors.map(error => error.message).join(', ')
        );
      }

      return { data: { customerUpdate: data.data.customerUpdate } };
    } catch (error) {
      console.error("❌ AuthApi: Customer update failed:", error);
      throw error;
    }
  }

  /**
   * Get current headers
   */
  getHeaders() {
    return { ...this.headers };
  }
}

// Create singleton instance
export const authApi = new AuthApi();

// Export the class for testing or multiple instances
export { AuthApi };
