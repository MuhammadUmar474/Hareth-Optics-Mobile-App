import { SHOPIFY_CONFIG, SHOPIFY_HEADERS } from "../constants/shopify";

type GraphQLError = { message: string };
type GraphQLResponse<T> = { data: T; errors?: GraphQLError[] };

// ==================== TYPES ====================

export type Money = {
  amount: string;
  currencyCode: string;
};

export type CheckoutLineItem = {
  variantId: string;
  quantity: number;
};

export type CheckoutCreateInput = {
  lineItems: CheckoutLineItem[];
  email?: string;
  phone?: string;
  note?: string;
  customAttributes?: {
    key: string;
    value: string;
  }[];
};

export type MailingAddressInput = {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
};

export type ShippingRate = {
  handle: string;
  title: string;
  price: Money;
};

export type CheckoutLineItemNode = {
  id: string;
  title: string;
  quantity: number;
  variant: {
    id: string;
    price: Money;
    title: string;
  };
};

export type Checkout = {
  id: string;
  webUrl: string;
  email?: string;
  phone?: string;
  subtotalPrice: Money;
  totalTax: Money;
  totalPrice: Money;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone?: string;
  };
  shippingLine?: {
    title: string;
    price: Money;
  };
  lineItems: {
    edges: {
      node: CheckoutLineItemNode;
    }[];
  };
  availableShippingRates?: {
    shippingRates: ShippingRate[];
  };
};

export type CheckoutUserError = {
  field: string[];
  message: string;
};

// ==================== RESPONSE TYPES ====================

export type CheckoutCreateResponse = {
  checkoutCreate: {
    checkout: Checkout | null;
    checkoutUserErrors: CheckoutUserError[];
  };
};

export type CheckoutShippingAddressUpdateResponse = {
  checkoutShippingAddressUpdateV2: {
    checkout: Checkout | null;
    checkoutUserErrors: CheckoutUserError[];
  };
};

export type GetShippingRatesResponse = {
  node: {
    availableShippingRates: {
      shippingRates: ShippingRate[];
    };
  } | null;
};

export type CheckoutShippingLineUpdateResponse = {
  checkoutShippingLineUpdate: {
    checkout: Checkout | null;
    checkoutUserErrors: CheckoutUserError[];
  };
};

export type CheckoutCustomerAssociateResponse = {
  checkoutCustomerAssociateV2: {
    checkout: Checkout | null;
    checkoutUserErrors: CheckoutUserError[];
  };
};

export type CustomerOrder = {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  totalPrice: Money;
  financialStatus: string;
  fulfillmentStatus: string;
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
        variant: {
          price: Money;
        };
      };
    }[];
  };
};

export type GetCustomerOrdersResponse = {
  customer: {
    orders: {
      edges: {
        node: CustomerOrder;
      }[];
    };
  } | null;
};

// ==================== CHECKOUT API CLASS ====================

class CheckoutApi {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = SHOPIFY_CONFIG.GRAPHQL_ENDPOINT;
    this.headers = { ...SHOPIFY_HEADERS };
  }

  /**
   * Execute a GraphQL query/mutation against Shopify Storefront API
   */
  private async executeQuery<TData = unknown>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<TData> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(variables ? { query, variables } : { query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    const data: GraphQLResponse<TData> = JSON.parse(responseText);

    if (data.errors && data.errors.length > 0) {
      throw new Error(data.errors.map((e) => e.message).join(", "));
    }

    if (!data.data) {
      throw new Error("No data returned");
    }

    return data.data;
  }

  /**
   * 1️⃣ Create Checkout
   * Note: For Storefront API, we use cart checkout URLs instead of creating separate checkouts
   * This method is kept for compatibility but should not be used in Storefront API flow
   */
  async createCheckout(
    input: CheckoutCreateInput
  ): Promise<CheckoutCreateResponse> {
    throw new Error(
      "createCheckout is not supported in Storefront API. Use cart checkout URLs instead."
    );
  }

  /**
   * 2️⃣ Add / Update Shipping Address
   * Attach the user's address to the checkout
   */
  async updateShippingAddress(
    checkoutId: string,
    shippingAddress: MailingAddressInput
  ): Promise<CheckoutShippingAddressUpdateResponse> {
    const query = `
      mutation checkoutShippingAddressUpdateV2($checkoutId: ID!, $shippingAddress: MailingAddressInput!) {
        checkoutShippingAddressUpdateV2(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
          checkout {
            id
            shippingAddress {
              firstName
              lastName
              address1
              city
              province
              country
              zip
            }
          }
          checkoutUserErrors {
            field
            message
          }
        }
      }
    `;

    return await this.executeQuery<CheckoutShippingAddressUpdateResponse>(
      query,
      {
        checkoutId,
        shippingAddress,
      }
    );
  }

  /**
   * 3️⃣ Get Shipping Rates
   * Get available shipping methods for the entered address
   */
  async getShippingRates(
    checkoutId: string
  ): Promise<GetShippingRatesResponse> {
    const query = `
      query getShippingRates($checkoutId: ID!) {
        node(id: $checkoutId) {
          ... on Checkout {
            availableShippingRates {
              shippingRates {
                handle
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    return await this.executeQuery<GetShippingRatesResponse>(query, {
      checkoutId,
    });
  }

  /**
   * 4️⃣ Select Shipping Rate
   * Set which shipping option the customer chose
   */
  async selectShippingRate(
    checkoutId: string,
    shippingRateHandle: string
  ): Promise<CheckoutShippingLineUpdateResponse> {
    const query = `
      mutation checkoutShippingLineUpdate($checkoutId: ID!, $shippingRateHandle: String!) {
        checkoutShippingLineUpdate(checkoutId: $checkoutId, shippingRateHandle: $shippingRateHandle) {
          checkout {
            id
            shippingLine {
              title
              price {
                amount
                currencyCode
              }
            }
          }
          checkoutUserErrors {
            field
            message
          }
        }
      }
    `;

    return await this.executeQuery<CheckoutShippingLineUpdateResponse>(query, {
      checkoutId,
      shippingRateHandle,
    });
  }

  /**
   * 5️⃣ Associate Logged-in Customer
   * Link the customer account to the checkout if user is logged in
   */
  async associateCustomer(
    checkoutId: string,
    customerAccessToken: string
  ): Promise<CheckoutCustomerAssociateResponse> {
    const query = `
      mutation checkoutCustomerAssociateV2($checkoutId: ID!, $customerAccessToken: String!) {
        checkoutCustomerAssociateV2(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
          checkout {
            id
            email
          }
          checkoutUserErrors {
            field
            message
          }
        }
      }
    `;

    return await this.executeQuery<CheckoutCustomerAssociateResponse>(query, {
      checkoutId,
      customerAccessToken,
    });
  }

  /**
   * 6️⃣ Get Orders After Payment
   * Retrieve customer orders after successful payment
   */
  async getCustomerOrders(
    customerAccessToken: string
  ): Promise<GetCustomerOrdersResponse> {
    const query = `
      query getCustomerOrders($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          orders(first: 10) {
            edges {
              node {
                id
                name
                orderNumber
                processedAt
                totalPrice {
                  amount
                  currencyCode
                }
                financialStatus
                fulfillmentStatus
                lineItems(first: 10) {
                  edges {
                    node {
                      title
                      quantity
                      variant {
                        price {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    return await this.executeQuery<GetCustomerOrdersResponse>(query, {
      customerAccessToken,
    });
  }

  /**
   * Helper method to convert cart items to checkout line items
   */
  convertCartToCheckoutItems(
    cartLines: {
      merchandise: { id: string };
      quantity: number;
    }[]
  ): CheckoutLineItem[] {
    return cartLines.map((line) => ({
      variantId: line.merchandise.id,
      quantity: line.quantity,
    }));
  }

  /**
   * Helper method to validate checkout response
   */
  validateCheckoutResponse(response: any): boolean {
    if (!response) return false;
    if (response.checkoutUserErrors && response.checkoutUserErrors.length > 0) {
      return false;
    }
    return true;
  }

  /**
   * Helper method to get error messages from checkout response
   */
  getCheckoutErrors(response: any): string[] {
    if (!response || !response.checkoutUserErrors) return [];
    return response.checkoutUserErrors.map(
      (error: CheckoutUserError) => error.message
    );
  }
}

// Singleton instance
export const checkoutApi = new CheckoutApi();
export { CheckoutApi };

// Export types for use in other files
export interface type {
  Checkout: Checkout;
  CheckoutCreateInput: CheckoutCreateInput;
  CheckoutUserError: CheckoutUserError;
  CustomerOrder: CustomerOrder;
  MailingAddressInput: MailingAddressInput;
  ShippingRate: ShippingRate;
}
