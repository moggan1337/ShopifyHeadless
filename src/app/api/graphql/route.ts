import { createYoga, createSchema } from 'graphql-yoga';
import { shopifyFetch, getProducts, getProductByHandle, getCollections } from '@/lib/shopify';

const typeDefs = /* GraphQL */ `
  type MoneyV2 {
    amount: String!
    currencyCode: String!
  }

  type Image {
    id: ID!
    url: String!
    altText: String
    width: Int!
    height: Int!
  }

  type ImageConnection {
    edges: [ImageEdge!]!
  }

  type ImageEdge {
    node: Image!
  }

  type SelectedOption {
    name: String!
    value: String!
  }

  type ProductVariant {
    id: ID!
    title: String!
    price: MoneyV2!
    compareAtPrice: MoneyV2
    availableForSale: Boolean!
    quantityAvailable: Int
    sku: String
    barcode: String
    selectedOptions: [SelectedOption!]!
    image: Image
  }

  type ProductVariantConnection {
    edges: [ProductVariantEdge!]!
  }

  type ProductVariantEdge {
    node: ProductVariant!
  }

  type SEO {
    title: String
    description: String
  }

  type PriceRange {
    minVariantPrice: MoneyV2!
    maxVariantPrice: MoneyV2!
  }

  type Product {
    id: ID!
    title: String!
    handle: String!
    description: String!
    descriptionHtml: String!
    vendor: String
    productType: String
    tags: [String!]!
    availableForSale: Boolean!
    priceRange: PriceRange!
    images(first: Int): ImageConnection!
    variants(first: Int): ProductVariantConnection!
    seo: SEO!
    createdAt: String!
    updatedAt: String!
  }

  type Collection {
    id: ID!
    title: String!
    handle: String!
    description: String!
    image: Image
    products(first: Int): ProductConnection!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type ProductConnection {
    edges: [ProductEdge!]!
    pageInfo: PageInfo!
  }

  type ProductEdge {
    node: Product!
    cursor: String!
  }

  type CartLine {
    id: ID!
    quantity: Int!
    cost: CartLineCost!
    merchandise: ProductVariant!
  }

  type CartLineCost {
    totalAmount: MoneyV2!
  }

  type CartLineConnection {
    edges: [CartLineEdge!]!
  }

  type CartLineEdge {
    node: CartLine!
  }

  type CartCost {
    subtotalAmount: MoneyV2!
    totalAmount: MoneyV2!
    totalTaxAmount: MoneyV2
  }

  type Cart {
    id: ID!
    checkoutUrl: String!
    totalQuantity: Int!
    cost: CartCost!
    lines: CartLineConnection!
    buyerIdentity: CartBuyerIdentity
  }

  type Customer {
    id: ID!
    email: String!
    firstName: String
    lastName: String
    phone: String
  }

  type CartBuyerIdentity {
    email: String
    phone: String
    countryCode: String
    customer: Customer
  }

  input CartLineInput {
    merchandiseId: ID!
    quantity: Int!
  }

  input CartBuyerIdentityInput {
    email: String
    phone: String
    countryCode: String
  }

  input CartInput {
    lines: [CartLineInput!]
    buyerIdentity: CartBuyerIdentityInput
  }

  type Query {
    products(first: Int, after: String): ProductConnection!
    productByHandle(handle: String!): Product
    collections(first: Int): CollectionConnection!
    collectionByHandle(handle: String!): Collection
  }

  type CollectionConnection {
    edges: [CollectionEdge!]!
  }

  type CollectionEdge {
    node: Collection!
  }

  type Mutation {
    createCart(input: CartInput): CartCreatePayload
  }

  type CartCreatePayload {
    cart: Cart
    userErrors: [UserError!]!
  }

  type UserError {
    field: [String!]
    message: String!
  }
`;

const resolvers = {
  Query: {
    products: async (_: unknown, args: { first: number; after?: string }) => {
      return getProducts(args.first, args.after);
    },
    productByHandle: async (_: unknown, args: { handle: string }) => {
      return getProductByHandle(args.handle);
    },
    collections: async () => {
      const collections = await getCollections();
      return { edges: collections.map((c) => ({ node: c })) };
    },
    collectionByHandle: async (_: unknown, args: { handle: string }) => {
      const { collection } = await getProductsByCollection(args.handle);
      return collection;
    },
  },
};

const schema = createSchema({
  typeDefs,
  resolvers,
});

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
});

export { handleRequest as GET, handleRequest as POST };
