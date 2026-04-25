// Shopify Types
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  images: ImageConnection;
  variants: ProductVariantConnection;
  seo: SEO;
  availableForSale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: MoneyV2;
  compareAtPrice: MoneyV2 | null;
  availableForSale: boolean;
  quantityAvailable: number;
  sku: string;
  barcode: string;
  selectedOptions: SelectedOption[];
  image: Image | null;
  product: ShopifyProduct;
}

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface Image {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ImageConnection {
  edges: Array<{
    node: Image;
  }>;
}

export interface ProductVariantConnection {
  edges: Array<{
    node: ProductVariant;
  }>;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface SEO {
  title: string;
  description: string;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: Image | null;
  products: ProductConnection;
}

export interface ProductConnection {
  edges: Array<{
    node: ShopifyProduct;
  }>;
  pageInfo: PageInfo;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

// Cart Types
export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: CartCost;
  lines: CartLineConnection;
  buyerIdentity: CartBuyerIdentity;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: ProductVariant;
  cost: CartLineCost;
}

export interface CartLineConnection {
  edges: Array<{
    node: CartLine;
  }>;
}

export interface CartCost {
  subtotalAmount: MoneyV2;
  totalAmount: MoneyV2;
  totalTaxAmount: MoneyV2 | null;
}

export interface CartLineCost {
  totalAmount: MoneyV2;
}

export interface CartBuyerIdentity {
  email: string | null;
  phone: string | null;
  customer: Customer | null;
  countryCode: string;
}

export interface CreateCartInput {
  lines?: CartLineInput[];
  buyerIdentity?: CartBuyerIdentityInput;
}

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  attributes?: AttributeInput[];
}

export interface CartBuyerIdentityInput {
  email?: string;
  phone?: string;
  countryCode?: string;
  customerAccessToken?: string;
}

export interface AttributeInput {
  key: string;
  value: string;
}

// Customer Types
export interface Customer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  orders: OrderConnection;
  metafields: MetafieldConnection;
}

export interface OrderConnection {
  edges: Array<{
    node: Order;
  }>;
  pageInfo: PageInfo;
}

export interface Order {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: OrderFinancialStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  totalPrice: MoneyV2;
  lineItems: LineItemConnection;
}

// Marketplace Types
export interface Vendor {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  banner: string | null;
  products: ShopifyProduct[];
  commission: CommissionTier[];
  rating: number;
  totalSales: number;
  joinedAt: string;
}

export interface CommissionTier {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number | null;
  commissionRate: number;
}

export interface Payout {
  id: string;
  vendorId: string;
  amount: MoneyV2;
  status: PayoutStatus;
  orders: string[];
  createdAt: string;
}

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

export interface Dispute {
  id: string;
  orderId: string;
  vendorId: string;
  customerId: string;
  reason: string;
  status: DisputeStatus;
  resolution: string | null;
  createdAt: string;
}

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed';

// Metafields
export interface Metafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

export interface MetafieldConnection {
  edges: Array<{
    node: Metafield;
  }>;
}

// API Response Types
export interface ShopifyApiResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

// Enums
export type OrderFinancialStatus = 
  | 'pending'
  | 'authorized'
  | 'partially_paid'
  | 'paid'
  | 'partially_refunded'
  | 'refunded'
  | 'voided';

export type OrderFulfillmentStatus = 
  | 'unfulfilled'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'restocked';
