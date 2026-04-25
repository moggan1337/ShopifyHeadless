import type {
  ShopifyProduct,
  Collection,
  Cart,
  CreateCartInput,
  Customer,
  ProductVariant,
  MoneyV2,
  Image,
} from '@/types/shopify';

const SHOPIFY_API_URL = process.env.SHOPIFY_STORE_DOMAIN
  ? `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION || '2024-10'}/graphql.json`
  : '';

const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ACCESS_TOKEN) {
    throw new Error('Missing Shopify configuration');
  }

  const response = await fetch(SHOPIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(', '));
  }

  if (!json.data) {
    throw new Error('No data returned from Shopify');
  }

  return json.data;
}

// Fragments for reusable query parts
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    createdAt
    updatedAt
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    images(first: 10) {
      edges {
        node { id url altText width height }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          availableForSale
          quantityAvailable
          sku
          barcode
          selectedOptions { name value }
          image { id url altText width height }
        }
      }
    }
    seo { title description }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
      totalTaxAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              image { id url altText width height }
              product { title handle }
              selectedOptions { name value }
            }
          }
        }
      }
    }
    buyerIdentity {
      email
      phone
      countryCode
      customer { id email firstName lastName }
    }
  }
`;

// Product Queries
export async function getProducts(first: number = 20, cursor?: string): Promise<{
  products: ShopifyProduct[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProducts($first: Int!, $cursor: String) {
      products(first: $first, after: $cursor) {
        edges { node { ...ProductFields } }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }>; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
  }>(query, { first, cursor });

  return {
    products: data.products.edges.map((e) => e.node),
    pageInfo: data.products.pageInfo,
  };
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) { ...ProductFields }
    }
  `;

  const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(query, { handle });
  return data.productByHandle;
}

export async function getProductsByCollection(
  collectionHandle: string,
  first: number = 20,
  cursor?: string
): Promise<{
  collection: Collection | null;
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query GetCollection($handle: String!, $first: Int!, $cursor: String) {
      collectionByHandle(handle: $handle) {
        id
        title
        handle
        description
        image { id url altText width height }
        products(first: $first, after: $cursor) {
          edges { node { ...ProductFields } }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collectionByHandle: Collection & {
      products: {
        edges: Array<{ node: ShopifyProduct }>;
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    } | null;
  }>(query, { handle: collectionHandle, first, cursor });

  if (!data.collectionByHandle) {
    return { collection: null, pageInfo: { hasNextPage: false, endCursor: null } };
  }

  return {
    collection: data.collectionByHandle,
    pageInfo: data.collectionByHandle.products.pageInfo,
  };
}

export async function searchProducts(searchTerm: string, first: number = 20): Promise<ShopifyProduct[]> {
  const query = `
    ${PRODUCT_FRAGMENT}
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges { node { ...ProductFields } }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>(query, { query: searchTerm, first });

  return data.products.edges.map((e) => e.node);
}

// Cart Mutations
export async function createCart(input?: CreateCartInput): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) { cart { ...CartFields } }
    }
  `;

  const data = await shopifyFetch<{ cartCreate: { cart: Cart } }>(query, { input: input || {} });
  return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
  `;

  const data = await shopifyFetch<{ cart: Cart | null }>(query, { cartId });
  return data.cart;
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>(query, { cartId, lines });
  return data.cartLinesAdd.cart;
}

export async function updateCart(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>(query, { cartId, lines });
  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const query = `
    ${CART_FRAGMENT}
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>(query, { cartId, lineIds });
  return data.cartLinesRemove.cart;
}

// Customer Queries
export async function getCustomer(accessToken: string): Promise<Customer | null> {
  const query = `
    query GetCustomer($accessToken: String!) {
      customer(customerAccessToken: $accessToken) {
        id
        email
        firstName
        lastName
        phone
        orders(first: 10) {
          edges {
            node {
              id
              name
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice { amount currencyCode }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ customer: Customer | null }>(query, { accessToken });
  return data.customer;
}

export async function createCustomerAccessToken(email: string, password: string): Promise<string | null> {
  const query = `
    mutation CreateAccessToken($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        userErrors { field message }
      }
    }
  `;

  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string } | null;
      userErrors: Array<{ message: string }>;
    };
  }>(query, { input: { email, password } });

  if (data.customerAccessTokenCreate.userErrors.length > 0) {
    throw new Error(data.customerAccessTokenCreate.userErrors[0].message);
  }

  return data.customerAccessTokenCreate.customerAccessToken?.accessToken || null;
}

// Collection Queries
export async function getCollections(first: number = 20): Promise<Collection[]> {
  const query = `
    query GetCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image { id url altText width height }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collections: { edges: Array<{ node: Collection }> };
  }>(query, { first });

  return data.collections.edges.map((e) => e.node);
}

// Checkout URL
export function getCheckoutUrl(cartId: string): string {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!storeDomain) return '#';
  return `https://${storeDomain}/cart/${cartId}`;
}

export { shopifyFetch };
