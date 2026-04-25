# ShopifyHeadless - Development Guide

## Project Overview

**ShopifyHeadless** is a high-performance headless commerce framework built with Next.js 15, TypeScript, and GraphQL. It provides a modern alternative to Shopify Hydrogen with enhanced features for multi-vendor marketplaces, custom checkouts, and real-time sync.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript 5.5 |
| **Styling** | Tailwind CSS 4, Radix UI, Framer Motion |
| **State** | Zustand, TanStack Query |
| **API** | GraphQL (graphql-yoga), REST (Next.js API Routes) |
| **Database** | PostgreSQL 16, Prisma ORM |
| **Cache** | Redis 7 |
| **Payments** | Stripe |

## Project Structure

```
ShopifyHeadless/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── graphql/       # GraphQL endpoint
│   │   │   └── vendors/       # Vendor API routes
│   │   ├── products/          # Product pages
│   │   ├── collections/       # Collection pages
│   │   ├── cart/              # Cart page
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── cart/              # Cart components
│   │   ├── layout/            # Header, Footer
│   │   ├── product/           # Product components
│   │   └── providers/         # React providers
│   ├── lib/
│   │   ├── shopify.ts         # Shopify API client
│   │   └── utils.ts           # Utility functions
│   ├── stores/                # Zustand stores
│   ├── types/                 # TypeScript types
│   └── messages/              # i18n translations
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                    # Static assets
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16
- Redis 7 (optional)
- Shopify Store (for production)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure .env.local:
# - SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
# - SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
# - DATABASE_URL=postgresql://...

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SHOPIFY_STORE_DOMAIN` | Your Shopify store domain | Yes |
| `SHOPIFY_ACCESS_TOKEN` | Storefront API access token | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | No |
| `STRIPE_SECRET_KEY` | Stripe secret key | No |
| `NEXTAUTH_SECRET` | NextAuth.js secret | No |
| `MINIMAX_API_KEY` | MiniMax API key for AI features | No |

## Key Features

### 1. Headless Storefront

The storefront is built with Next.js 15 App Router and uses Shopify's Storefront GraphQL API for fetching products, collections, and cart data.

**Key Files:**
- `src/lib/shopify.ts` - Shopify API client
- `src/components/product/ProductCard.tsx` - Product display
- `src/app/products/[handle]/page.tsx` - Product detail page

### 2. Multi-Vendor Marketplace

Vendors can register, manage products, view analytics, and receive payouts.

**Key Files:**
- `prisma/schema.prisma` - Vendor models
- `src/stores/vendor.ts` - Vendor state management
- `src/app/api/vendors/` - Vendor API routes

### 3. Cart Management

Uses Zustand for client-side cart state with persistence.

**Key Files:**
- `src/stores/cart.ts` - Cart store
- `src/components/cart/CartDrawer.tsx` - Cart drawer
- `src/lib/shopify.ts` - Cart mutations

### 4. GraphQL API

Custom GraphQL endpoint at `/api/graphql` using graphql-yoga.

**Key Files:**
- `src/app/api/graphql/route.ts` - GraphQL handler
- `src/lib/shopify.ts` - Resolvers

## Development

### Adding New Components

1. Create component in appropriate `src/components/` directory
2. Use TypeScript and follow existing patterns
3. Export from `src/components/index.ts` if needed

### Adding New API Routes

1. Create route in `src/app/api/`
2. Use Prisma for database operations
3. Handle errors gracefully with proper HTTP status codes

### Database Operations

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Push schema changes (dev only)
npm run db:push

# Open Prisma Studio
npm run db:studio
```

## Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Deployment

### Vercel (Recommended)

```bash
vercel
```

Set environment variables in Vercel dashboard.

### Docker

```bash
docker build -t shopify-headless .
docker run -p 3000:3000 shopify-headless
```

## Code Style

- Use TypeScript strict mode
- Prefer functional components with hooks
- Use `cn()` utility for classnames
- Follow ESLint and Prettier config
- Write tests for new features

## LLM Integration

This project supports AI features using MiniMax models:

- **Model**: MiniMax-M2.7
- **Configuration**: Set `minimax_model="MiniMax-M2.7"` in config
- **Features**: Product recommendations, smart search, chatbot

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes with clear messages
4. Push and create Pull Request

## License

MIT License
