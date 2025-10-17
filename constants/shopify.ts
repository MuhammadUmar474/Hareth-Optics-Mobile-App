export const SHOPIFY_CONFIG = {
  STORE_DOMAIN: 'harethoptics.com',
  STOREFRONT_ACCESS_TOKEN: '083bc155ff81a9568c8ed187631956f7',
  API_VERSION: '2024-01',
  GRAPHQL_ENDPOINT: 'https://harethoptics.com/api/2024-01/graphql.json',
} as const;

export const SHOPIFY_HEADERS = {
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.STOREFRONT_ACCESS_TOKEN,
} as const;
