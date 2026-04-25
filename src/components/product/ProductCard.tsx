'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { formatMoney, calculateDiscountPercentage, getImageUrl } from '@/lib/utils';
import type { ShopifyProduct } from '@/types/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
  priority?: boolean;
  showVendor?: boolean;
  showActions?: boolean;
}

export function ProductCard({
  product,
  priority = false,
  showVendor = false,
  showActions = true,
}: ProductCardProps) {
  const { addItem, isLoading } = useCartStore();
  
  const primaryImage = product.images.edges[0]?.node;
  const secondaryImage = product.images.edges[1]?.node;
  
  const price = product.priceRange.minVariantPrice;
  const comparePrice = product.variants.edges[0]?.node.compareAtPrice;
  const discount = calculateDiscountPercentage(
    comparePrice?.amount,
    price.amount
  );
  
  const firstVariant = product.variants.edges[0]?.node;
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant || !product.availableForSale) return;
    
    await addItem(firstVariant.id, 1);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link href={`/products/${product.handle}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
          )}
          
          {/* Secondary Image on Hover */}
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.altText || product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            />
          )}
          
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {discount && (
              <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                -{discount}%
              </span>
            )}
            {!product.availableForSale && (
              <span className="rounded-full bg-neutral-900 px-2 py-1 text-xs font-semibold text-white">
                Sold Out
              </span>
            )}
          </div>
          
          {/* Quick Actions */}
          {showActions && product.availableForSale && (
            <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
                aria-label="Add to cart"
              >
                <ShoppingBag className="h-5 w-5" />
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110"
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5" />
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110"
                aria-label="Quick view"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="mt-4 space-y-1">
          {showVendor && product.vendor && (
            <p className="text-xs font-medium text-neutral-500">{product.vendor}</p>
          )}
          
          <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 group-hover:text-shopify-green">
            {product.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">
              {formatMoney(price.amount, price.currencyCode)}
            </span>
            {comparePrice && (
              <span className="text-sm text-neutral-500 line-through">
                {formatMoney(comparePrice.amount, comparePrice.currencyCode)}
              </span>
            )}
          </div>
          
          {/* Rating placeholder */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}
              />
            ))}
            <span className="text-xs text-neutral-500">(128)</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// Skeleton loader for ProductCard
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-lg bg-neutral-200" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-16 rounded bg-neutral-200" />
        <div className="h-4 w-3/4 rounded bg-neutral-200" />
        <div className="h-4 w-1/2 rounded bg-neutral-200" />
      </div>
    </div>
  );
}
