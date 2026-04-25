'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Heart, Truck, Shield, ArrowLeft, Share2 } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { formatMoney, calculateDiscountPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { ShopifyProduct, ProductVariant } from '@/types/shopify';

interface ProductDetailsProps {
  product: ShopifyProduct;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.edges[0]?.node || null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  
  const { addItem } = useCartStore();
  
  const images = product.images.edges.map((e) => e.node);
  const discount = selectedVariant?.compareAtPrice
    ? calculateDiscountPercentage(selectedVariant.compareAtPrice.amount, selectedVariant.price.amount)
    : null;
  
  const handleAddToCart = async () => {
    if (!selectedVariant || !product.availableForSale) return;
    
    setIsAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
    } finally {
      setIsAdding(false);
    }
  };
  
  // Get unique options from variants
  const optionNames = [...new Set(
    product.variants.edges.flatMap((e) => 
      e.node.selectedOptions.map((o) => o.name)
    )
  )];
  
  const getOptionValues = (optionName: string) => {
    return [...new Set(
      product.variants.edges
        .map((e) => e.node.selectedOptions.find((o) => o.name === optionName)?.value)
        .filter(Boolean)
    )] as string[];
  };
  
  const findVariantByOptions = (options: { name: string; value: string }[]) => {
    return product.variants.edges.find((e) => {
      const variantOptions = e.node.selectedOptions;
      return options.every((opt) =>
        variantOptions.some((vOpt) => vOpt.name === opt.name && vOpt.value === opt.value)
      );
    })?.node;
  };
  
  return (
    <div className="mt-8">
      {/* Back Link */}
      <Link
        href="/collections/all"
        className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-shopify-green"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>
      
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100">
            {images[selectedImage] && (
              <Image
                src={images[selectedImage].url}
                alt={images[selectedImage].altText || product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
            
            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {discount && (
                <span className="rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white">
                  -{discount}%
                </span>
              )}
              {!product.availableForSale && (
                <span className="rounded-full bg-neutral-900 px-3 py-1.5 text-sm font-semibold text-white">
                  Sold Out
                </span>
              )}
            </div>
          </div>
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg',
                    selectedImage === index
                      ? 'ring-2 ring-shopify-green'
                      : 'opacity-60 hover:opacity-100'
                  )}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="flex flex-col">
          {/* Vendor */}
          {product.vendor && (
            <Link
              href={`/vendors/${product.vendor.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-shopify-green hover:underline"
            >
              {product.vendor}
            </Link>
          )}
          
          {/* Title */}
          <h1 className="mt-2 font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
            {product.title}
          </h1>
          
          {/* Price */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-neutral-900">
              {formatMoney(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount)}
            </span>
            {selectedVariant?.compareAtPrice && (
              <>
                <span className="text-xl text-neutral-500 line-through">
                  {formatMoney(selectedVariant.compareAtPrice.amount)}
                </span>
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                  Save {formatMoney(
                    parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)
                  )}
                </span>
              </>
            )}
          </div>
          
          {/* Description */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Description</h2>
            <div
              className="mt-3 Prose prose-neutral max-w-none text-neutral-600"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
          
          {/* Options */}
          {optionNames.map((optionName) => (
            <div key={optionName} className="mt-8">
              <h3 className="text-sm font-medium text-neutral-900">
                {optionName}: <span className="text-neutral-600">{selectedVariant?.selectedOptions.find(o => o.name === optionName)?.value}</span>
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {getOptionValues(optionName).map((value) => {
                  const variant = findVariantByOptions([{ name: optionName, value }]);
                  const isSelected = selectedVariant?.selectedOptions.some(
                    (o) => o.name === optionName && o.value === value
                  );
                  const isAvailable = variant?.availableForSale ?? false;
                  
                  return (
                    <button
                      key={value}
                      onClick={() => variant && setSelectedVariant(variant)}
                      disabled={!isAvailable}
                      className={cn(
                        'rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                        isSelected
                          ? 'border-shopify-green bg-shopify-green text-white'
                          : isAvailable
                          ? 'border-neutral-300 hover:border-shopify-green'
                          : 'border-neutral-200 text-neutral-400 cursor-not-allowed line-through'
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Quantity */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-neutral-900">Quantity</h3>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center border border-neutral-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="flex h-12 w-12 items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-12 w-12 items-center justify-center text-neutral-600 hover:bg-neutral-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-neutral-500">
                {selectedVariant?.quantityAvailable ?? 0} available
              </span>
            </div>
          </div>
          
          {/* Add to Cart */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={!product.availableForSale || isAdding}
              className={cn(
                'flex-1 flex items-center justify-center gap-3 rounded-full py-4 text-base font-semibold transition-all',
                product.availableForSale
                  ? 'bg-shopify-green text-white hover:bg-shopify-green/90'
                  : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
              )}
            >
              {isAdding ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                />
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  {product.availableForSale ? 'Add to Cart' : 'Sold Out'}
                </>
              )}
            </button>
            
            <button
              className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-50"
              aria-label="Add to wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-50"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          
          {/* Trust Badges */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-4">
              <Truck className="h-6 w-6 text-shopify-green" />
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-neutral-500">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-4">
              <Shield className="h-6 w-6 text-shopify-green" />
              <div>
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-neutral-500">100% secure checkout</p>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-neutral-900">Tags</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
