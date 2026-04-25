import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/components/providers/CartProvider';
import { Providers } from '@/components/providers/Providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-cal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ShopifyHeadless - Modern Headless Commerce',
    template: '%s | ShopifyHeadless',
  },
  description: 'High-performance headless commerce framework with Next.js, GraphQL, and multi-vendor support.',
  keywords: ['shopify', 'headless', 'commerce', 'next.js', 'ecommerce', 'storefront'],
  authors: [{ name: 'moggan1337' }],
  creator: 'moggan1337',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shopifyheadless.dev',
    siteName: 'ShopifyHeadless',
    title: 'ShopifyHeadless - Modern Headless Commerce',
    description: 'High-performance headless commerce framework with Next.js, GraphQL, and multi-vendor support.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopifyHeadless',
    description: 'High-performance headless commerce framework',
    creator: '@moggan1337',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#95BF47',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-white font-sans text-neutral-900 antialiased">
        <Providers>
          <CartProvider>
            <Header />
            <main className="pt-16 lg:pt-20">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
