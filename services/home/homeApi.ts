import { SHOPIFY_CONFIG, SHOPIFY_HEADERS } from "../../constants/shopify";

type GraphQLError = { message: string };
type GraphQLResponse<T> = { data: T; errors?: GraphQLError[] };

export type MenuItem = {
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
}

// Singleton instance
export const homeApi = new HomeApi();
export { HomeApi };

// Small helper to allow calling with raw query text anywhere
export const executeHomeQuery = async <TData = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<TData> => homeApi.executeQuery<TData>(query, variables);
