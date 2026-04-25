import { notFound } from 'next/navigation';
import { getProductByHandle, getProducts } from '@/lib/shopify';
import { ProductDetails } from '@/components/product/ProductDetails';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }
  
  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    openGraph: {
      title: product.seo.title || product.title,
      description: product.seo.description || product.description,
      images: product.images.edges.map(({ node }) => node.url),
    },
  };
}

export async function generateStaticParams() {
  const { products } = await getProducts(100);
  
  return products.map((product) => ({
    handle: product.handle,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  
  // In production, this would fetch from Shopify
  // For demo, we'll show a placeholder
  const product = await getProductByHandle(handle);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
    </div>
  );
}
