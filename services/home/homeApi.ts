import { SHOPIFY_CONFIG, SHOPIFY_HEADERS } from "../../constants/shopify";

type GraphQLError = { message: string };
type GraphQLResponse<T> = { data: T; errors?: GraphQLError[] };

export type MenuItem = {
  resource: any;
  id: string;
  title: string;
  url: string;
  type: string;
  items?: MenuItem[];
};

export type Menu = {
  id: string;
  title: string;
  items: MenuItem[];
};

// Types for Latest Products response
type Image = { url: string; altText?: string | null };
type SelectedOption = { name: string; value: string };
type Money = { amount: string; currencyCode: string };
type VariantNode = {
  title: string;
  sku?: string | null;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
};
type ProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string;
  createdAt: string;
  featuredImage: Image | null;
  images: { edges: { node: Image }[] };
  priceRange: { minVariantPrice: Money };
  variants: { edges: { node: VariantNode }[] };
};
export type LatestProductsResponse = {
  products: { edges: { node: ProductNode }[] };
};

type ProductDetailVariant = {
  id: string;
  title: string;
  sku?: string | null;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money | null;
  image?: Image | null;
  selectedOptions: SelectedOption[];
};

type ProductDetailNode = {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType?: string | null;
  vendor?: string | null;
  tags: string[];
  availableForSale: boolean;
  totalInventory?: number | null;
  featuredImage?: Image | null;
  images: { edges: { node: Image }[] };
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  variants: { edges: { node: ProductDetailVariant }[] };
};

export type ProductDetailResponse = {
  product: ProductDetailNode | null;
};

// Types for Products by Collection response
type SEO = { title?: string | null; description?: string | null };
type Metafield = {
  key: string;
  value: string;
  namespace: string;
  type: string;
};
type CollectionVariantNode = {
  id: string;
  title: string;
  sku?: string | null;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice?: Money | null;
  image?: Image | null;
};
type CollectionProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType?: string | null;
  vendor?: string | null;
  availableForSale: boolean;
  totalInventory?: number | null;
  tags: string[];
  featuredImage: Image | null;
  images: { edges: { node: Image }[] };
  variants: { edges: { node: CollectionVariantNode }[] };
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  seo?: SEO | null;
  metafields: Metafield[];
};
export type ProductsByCollectionResponse = {
  collection: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: Image | null;
    products: { 
      edges: { node: CollectionProductNode }[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  } | null;
};

// Types for All Products response (paginated)
type AllProductsVariantNode = CollectionVariantNode;
type AllProductsProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType?: string | null;
  vendor?: string | null;
  tags: string[];
  featuredImage: Image | null;
  images: { edges: { node: Image }[] };
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  variants: { edges: { node: AllProductsVariantNode }[] };
};
export type AllProductsResponse = {
  products: {
    edges: { node: AllProductsProductNode }[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

// Types for Search Products response
export type SearchProductsResponse = {
  products: {
    edges: { node: AllProductsProductNode }[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

// Types for Address Management
export type ShopifyAddress = {
  id: string;
  address1: string;
  address2?: string | null;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export type MailingAddressInput = {
  address1: string;
  address2?: string | null;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export type CustomerUserError = {
  field: string[];
  message: string;
};

export type GetAddressesResponse = {
  customer: {
    addresses: {
      edges: {
        node: ShopifyAddress;
      }[];
    };
    defaultAddress: ShopifyAddress | null;
  } | null;
};

export type CreateAddressResponse = {
  customerAddressCreate: {
    customerAddress: ShopifyAddress | null;
    customerUserErrors: CustomerUserError[];
  };
};

export type UpdateAddressResponse = {
  customerAddressUpdate: {
    customerAddress: ShopifyAddress | null;
    customerUserErrors: CustomerUserError[];
  };
};

export type DeleteAddressResponse = {
  customerAddressDelete: {
    deletedCustomerAddressId: string | null;
    customerUserErrors: CustomerUserError[];
  };
};

export type SetDefaultAddressResponse = {
  customerDefaultAddressUpdate: {
    customer: {
      defaultAddress: ShopifyAddress | null;
    } | null;
    customerUserErrors: CustomerUserError[];
  };
};

class HomeApi {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = SHOPIFY_CONFIG.GRAPHQL_ENDPOINT;
    this.headers = { ...SHOPIFY_HEADERS };
  }

  /**
   * Execute an arbitrary GraphQL query/mutation against Shopify Storefront API.
   * Pass the raw GraphQL document string and optional variables.
   */
  async executeQuery<TData = unknown>(
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
   * Convenience helper for your provided `GetLatestProducts` query.
   */
  async getLatestProducts(): Promise<LatestProductsResponse> {
    const query = `
      query GetLatestProducts {
        products(first: 20, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              title
              handle
              description
              createdAt
              featuredImage { url altText }
              images(first: 5) { edges { node { url altText } } }
              priceRange { minVariantPrice { amount currencyCode } }
              variants(first: 10) {
                edges {
                  node {
                    title
                    sku
                    availableForSale
                    selectedOptions { name value }
                    price { amount currencyCode }
                  }
                }
              }
            }
          }
        }
      }
    `;

    return await this.executeQuery<LatestProductsResponse>(query);
  }

  /**
   * Get product details by ID
   */
  async getProductById(id: string): Promise<ProductDetailResponse> {
    const query = `
      query getProductById($id: ID!) {
        product(id: $id) {
          id
          title
          description
          handle
          productType
          vendor
          tags
          availableForSale
          totalInventory
          featuredImage { url altText }
          images(first: 10) { edges { node { url altText } } }
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                image { url altText }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    `;

    return await this.executeQuery<ProductDetailResponse>(query, { id });
  }

  /**
   * Fetch products for a specific collection handle.
   */
  async getProductsByCollection(
    handle: string,
    first: number = 20,
    after?: string // add `after` cursor for pagination
  ): Promise<ProductsByCollectionResponse> {
    const query = `
      query GetProductsByCollection($handle: String!, $first: Int = 20, $after: String) {
        collection(handle: $handle) {
          id
          title
          handle
          description
          image { url altText }
          products(first: $first, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              cursor
              node {
                id
                title
                handle
                productType
                vendor
                availableForSale
                totalInventory
                tags
                featuredImage { url altText }
                images(first: 10) { edges { node { url altText } } }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      title
                      sku
                      availableForSale
                      selectedOptions { name value }
                      price { amount currencyCode }
                      compareAtPrice { amount currencyCode }
                      image { url altText }
                    }
                  }
                }
                priceRange {
                  minVariantPrice { amount currencyCode }
                  maxVariantPrice { amount currencyCode }
                }
                seo { title description }
                metafields(
                  identifiers: [
                    { namespace: "custom", key: "color" },
                    { namespace: "custom", key: "size" }
                  ]
                ) {
                  key
                  value
                  namespace
                  type
                }
              }
            }
          }
        }
      }
    `;
  
    return await this.executeQuery<ProductsByCollectionResponse>(query, {
      handle,
      first,
      after, // pass cursor
    });
  }

  /**
   * Fetch all products with pagination support.
   */
  async getAllProducts(
    first: number,
    after?: string
  ): Promise<AllProductsResponse> {
    const query = `
      query GetAllProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node {
              id
              title
              handle
              description
              productType
              vendor
              tags
              featuredImage { url altText }
              images(first: 5) { edges { node { url altText } } }
              priceRange {
                minVariantPrice { amount currencyCode }
                maxVariantPrice { amount currencyCode }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    sku
                    availableForSale
                    selectedOptions { name value }
                    price { amount currencyCode }
                    compareAtPrice { amount currencyCode }
                    image { url altText }
                  }
                }
              }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    `;

    return await this.executeQuery<AllProductsResponse>(query, {
      first,
      after,
    });
  }

  /**
   * Search products by a query string with pagination support.
   */
  async searchProducts(
    queryString: string,
    first: number = 50,
    after?: string
  ): Promise<SearchProductsResponse> {
    const query = `
      query SearchProducts($query: String!, $first: Int = 50, $after: String) {
        products(first: $first, after: $after, query: $query) {
          edges {
            node {
              id
              title
              handle
              description
              productType
              vendor
              tags
              featuredImage { url altText }
              images(first: 5) { edges { node { url altText } } }
              priceRange {
                minVariantPrice { amount currencyCode }
                maxVariantPrice { amount currencyCode }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    selectedOptions { name value }
                    price { amount currencyCode }
                  }
                }
              }
            }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    `;

    return await this.executeQuery<SearchProductsResponse>(query, {
      query: queryString,
      first,
      after,
    });
  }

  async getMainMenu(): Promise<Menu> {
    const query = `
      query GetMainMenu { menu(handle: \"mega-menu\") { id title items { id title url type resource { ... on Collection { id title handle image { url altText } } ... on Product { id title handle featuredImage { url altText } } } items { id title url type resource { ... on Collection { id title handle image { url altText } } ... on Product { id title handle featuredImage { url altText } } } } } } }
    `

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    const data: GraphQLResponse<{ menu: Menu | null }> =
      JSON.parse(responseText);

    if (data.errors && data.errors.length > 0) {
      throw new Error(data.errors.map((e) => e.message).join(", "));
    }

    if (!data.data || !data.data.menu) {
      return { id: "main-menu-empty", title: "Main Menu", items: [] };
    }

    return data.data.menu;
  }

  // Convenience alias if you only need the top-level categories
  async getCategories(): Promise<MenuItem[]> {
    const menu = await this.getMainMenu();
    return menu.items || [];
  }

  /**
   * Get customer addresses
   */
  async getCustomerAddresses(customerAccessToken: string): Promise<GetAddressesResponse> {
    const query = `
      query GetCustomerAddresses($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          addresses(first: 10) {
            edges {
              node {
                id
                address1
                address2
                city
                province
                country
                zip
                phone
                firstName
                lastName
              }
            }
          }
          defaultAddress {
            id
            address1
            address2
            city
            province
            country
            zip
            phone
            firstName
            lastName
          }
        }
      }
    `;

    return await this.executeQuery<GetAddressesResponse>(query, {
      customerAccessToken,
    });
  }

  /**
   * Create a new customer address
   */
  async createCustomerAddress(
    customerAccessToken: string,
    address: MailingAddressInput
  ): Promise<CreateAddressResponse> {
    const query = `
      mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
        customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
          customerAddress {
            id
            address1
            address2
            city
            province
            country
            zip
            phone
            firstName
            lastName
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `;

    return await this.executeQuery<CreateAddressResponse>(query, {
      customerAccessToken,
      address,
    });
  }

  /**
   * Update an existing customer address
   */
  async updateCustomerAddress(
    customerAccessToken: string,
    id: string,
    address: MailingAddressInput
  ): Promise<UpdateAddressResponse> {
    const query = `
      mutation CustomerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
        customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
          customerAddress {
            id
            address1
            address2
            city
            province
            country
            zip
            phone
            firstName
            lastName
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `;

    return await this.executeQuery<UpdateAddressResponse>(query, {
      customerAccessToken,
      id,
      address,
    });
  }

  /**
   * Delete a customer address
   */
  async deleteCustomerAddress(
    customerAccessToken: string,
    id: string
  ): Promise<DeleteAddressResponse> {
    const query = `
      mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
        customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
          deletedCustomerAddressId
          customerUserErrors {
            field
            message
          }
        }
      }
    `;

    return await this.executeQuery<DeleteAddressResponse>(query, {
      customerAccessToken,
      id,
    });
  }

  /**
   * Set default customer address
   */
  async setDefaultCustomerAddress(
    customerAccessToken: string,
    addressId: string
  ): Promise<SetDefaultAddressResponse> {
    const query = `
      mutation CustomerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
        customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
          customer {
            defaultAddress {
              id
              address1
              city
              country
            }
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `;

    return await this.executeQuery<SetDefaultAddressResponse>(query, {
      customerAccessToken,
      addressId,
    });
  }
}

// Singleton instance
export const homeApi = new HomeApi();
export { HomeApi };

// Small helper to allow calling with raw query text anywhere
export const executeHomeQuery = async <TData = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<TData> => homeApi.executeQuery<TData>(query, variables);
