import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, CreditCard, Headphones, Zap, Globe } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard';
import type { ShopifyProduct } from '@/types/shopify';

// Demo products for showcase (when Shopify API is not configured)
const DEMO_PRODUCTS: ShopifyProduct[] = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    handle: 'premium-wireless-headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    descriptionHtml: '<p>High-quality wireless headphones with noise cancellation</p>',
    vendor: 'AudioTech',
    productType: 'Electronics',
    tags: ['wireless', 'headphones', 'audio'],
    availableForSale: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceRange: {
      minVariantPrice: { amount: '299.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '349.99', currencyCode: 'USD' },
    },
    images: {
      edges: [
        {
          node: {
            id: '1',
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=800&fit=crop',
            altText: 'Premium Wireless Headphones',
            width: 600,
            height: 800,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: 'v1',
            title: 'Default Title',
            price: { amount: '299.99', currencyCode: 'USD' },
            compareAtPrice: { amount: '399.99', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 50,
            sku: 'WH-001',
            barcode: '123456789',
            selectedOptions: [{ name: 'Title', value: 'Default Title' }],
            image: null,
            product: {} as ShopifyProduct,
          },
        },
      ],
    },
    seo: { title: 'Premium Wireless Headphones', description: 'High-quality wireless headphones' },
  },
  {
    id: '2',
    title: 'Minimalist Watch Collection',
    handle: 'minimalist-watch',
    description: 'Elegant minimalist watches for everyday wear',
    descriptionHtml: '<p>Elegant minimalist watches</p>',
    vendor: 'TimeStyle',
    productType: 'Accessories',
    tags: ['watch', 'fashion', 'minimalist'],
    availableForSale: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceRange: {
      minVariantPrice: { amount: '189.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '249.00', currencyCode: 'USD' },
    },
    images: {
      edges: [
        {
          node: {
            id: '2',
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop',
            altText: 'Minimalist Watch',
            width: 600,
            height: 800,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: 'v2',
            title: 'Silver',
            price: { amount: '189.00', currencyCode: 'USD' },
            compareAtPrice: null,
            availableForSale: true,
            quantityAvailable: 30,
            sku: 'MW-001',
            barcode: '234567890',
            selectedOptions: [{ name: 'Color', value: 'Silver' }],
            image: null,
            product: {} as ShopifyProduct,
          },
        },
      ],
    },
    seo: { title: 'Minimalist Watch', description: 'Elegant minimalist watches' },
  },
  {
    id: '3',
    title: 'Organic Cotton T-Shirt',
    handle: 'organic-cotton-tshirt',
    description: 'Sustainable and comfortable everyday t-shirt',
    descriptionHtml: '<p>Sustainable cotton t-shirt</p>',
    vendor: 'EcoWear',
    productType: 'Apparel',
    tags: ['organic', 'sustainable', 'tshirt'],
    availableForSale: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceRange: {
      minVariantPrice: { amount: '49.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '59.00', currencyCode: 'USD' },
    },
    images: {
      edges: [
        {
          node: {
            id: '3',
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
            altText: 'Organic Cotton T-Shirt',
            width: 600,
            height: 800,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: 'v3',
            title: 'White / M',
            price: { amount: '49.00', currencyCode: 'USD' },
            compareAtPrice: null,
            availableForSale: true,
            quantityAvailable: 100,
            sku: 'TS-001',
            barcode: '345678901',
            selectedOptions: [{ name: 'Size', value: 'M' }],
            image: null,
            product: {} as ShopifyProduct,
          },
        },
      ],
    },
    seo: { title: 'Organic Cotton T-Shirt', description: 'Sustainable everyday t-shirt' },
  },
  {
    id: '4',
    title: 'Smart Home Speaker',
    handle: 'smart-home-speaker',
    description: 'Voice-controlled smart speaker with premium sound',
    descriptionHtml: '<p>Voice-controlled smart speaker</p>',
    vendor: 'TechVision',
    productType: 'Electronics',
    tags: ['smart', 'speaker', 'voice-assistant'],
    availableForSale: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priceRange: {
      minVariantPrice: { amount: '129.00', currencyCode: 'USD' },
      maxVariantPrice: { amount: '149.00', currencyCode: 'USD' },
    },
    images: {
      edges: [
        {
          node: {
            id: '4',
            url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&h=800&fit=crop',
            altText: 'Smart Home Speaker',
            width: 600,
            height: 800,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: 'v4',
            title: 'Black',
            price: { amount: '129.00', currencyCode: 'USD' },
            compareAtPrice: { amount: '179.00', currencyCode: 'USD' },
            availableForSale: true,
            quantityAvailable: 45,
            sku: 'SS-001',
            barcode: '456789012',
            selectedOptions: [{ name: 'Color', value: 'Black' }],
            image: null,
            product: {} as ShopifyProduct,
          },
        },
      ],
    },
    seo: { title: 'Smart Home Speaker', description: 'Voice-controlled smart speaker' },
  },
];

const FEATURES = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: CreditCard,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Always here to help',
  },
];

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built on Next.js 15 with edge deployment',
  },
  {
    icon: Globe,
    title: 'Global Ready',
    description: 'Multi-currency and multi-language support',
  },
];

export default function HomePage() {
  // In production, fetch products from Shopify API
  const featuredProducts = DEMO_PRODUCTS;
  const newArrivals = DEMO_PRODUCTS.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="max-w-xl">
              <span className="inline-block rounded-full bg-shopify-green/10 px-4 py-2 text-sm font-medium text-shopify-green">
                🚀 New: AI-Powered Search
              </span>
              <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl">
                The Future of{' '}
                <span className="text-shopify-green">Headless Commerce</span>
              </h1>
              <p className="mt-6 text-lg text-neutral-600">
                Build blazing-fast storefronts with custom checkout flows, multi-vendor support, 
                and real-time Shopify sync. The ultimate Hydrogen replacement.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/collections/all"
                  className="inline-flex items-center gap-2 rounded-full bg-shopify-green px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-shopify-green/90"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
                >
                  View Demo
                </Link>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-shopify-green/20 to-shopify-green/5">
                <Image
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1000&fit=crop"
                  alt="Modern e-commerce storefront"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              {/* Floating Cards */}
              <div className="absolute -left-4 top-1/4 rounded-xl bg-white p-4 shadow-xl">
                <p className="text-sm font-medium">Sales Today</p>
                <p className="text-2xl font-bold text-shopify-green">$12,847</p>
              </div>
              <div className="absolute -right-4 bottom-1/4 rounded-xl bg-white p-4 shadow-xl">
                <p className="text-sm font-medium">Active Vendors</p>
                <p className="text-2xl font-bold text-shopify-green">248</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-shopify-green/10">
                  <feature.icon className="h-6 w-6 text-shopify-green" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{feature.title}</p>
                  <p className="text-sm text-neutral-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Highlights */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {HIGHLIGHTS.map((highlight) => (
              <div
                key={highlight.title}
                className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-shopify-green">
                  <highlight.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{highlight.title}</h3>
                  <p className="mt-2 text-neutral-600">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
                Featured Products
              </h2>
              <p className="mt-2 text-neutral-600">
                Handpicked items just for you
              </p>
            </div>
            <Link
              href="/collections/featured"
              className="hidden items-center gap-2 text-sm font-semibold text-shopify-green hover:underline md:flex"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/collections/featured"
              className="inline-flex items-center gap-2 text-sm font-semibold text-shopify-green"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Banner */}
      <section className="bg-shopify-dark py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-shopify-green px-4 py-2 text-sm font-medium text-white">
              Just Dropped
            </span>
            <h2 className="mt-6 font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              New Arrivals Are Here
            </h2>
            <p className="mt-4 text-lg text-neutral-300">
              Fresh styles, latest trends, and cutting-edge technology. 
              Be the first to get your hands on the newest products.
            </p>
            <Link
              href="/collections/new"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-shopify-green px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-shopify-green/90"
            >
              Shop New Arrivals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
                New Arrivals
              </h2>
              <p className="mt-2 text-neutral-600">
                The latest additions to our store
              </p>
            </div>
            <Link
              href="/collections/new"
              className="hidden items-center gap-2 text-sm font-semibold text-shopify-green hover:underline md:flex"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} priority />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-heading text-2xl font-bold text-neutral-900 md:text-3xl">
              Stay in the Loop
            </h2>
            <p className="mt-2 text-neutral-600">
              Subscribe to our newsletter for exclusive deals, new arrivals, and more.
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-neutral-300 px-6 py-3 outline-none focus:border-shopify-green"
              />
              <button
                type="submit"
                className="rounded-full bg-shopify-green px-8 py-3 font-semibold text-white transition-colors hover:bg-shopify-green/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Multi-Vendor CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-shopify-green to-shopify-green/80 p-8 md:p-16">
            <div className="relative z-10 max-w-xl">
              <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
                Become a Vendor
              </h2>
              <p className="mt-4 text-lg text-white/90">
                Join our marketplace and reach thousands of customers. 
                Set your own prices, manage your inventory, and grow your business.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/vendor/register"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-shopify-green transition-colors hover:bg-white/90"
                >
                  Start Selling
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/vendor/learn-more"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
          </div>
        </div>
      </section>
    </div>
  );
}
