import { SHOPIFY_CONFIG, SHOPIFY_HEADERS } from '../../constants/shopify';
import { AuthApiResponse, LoginCredentials, LoginResponse, SignupCredentials, SignupResponse } from '../../types/auth';

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
   * Remove authorization header
   */
  clearAuthToken() {
    delete this.headers['Authorization'];
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
