'use client';

import { Fragment, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore, selectCartItems } from '@/stores/cart';
import { formatMoney } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateItem, removeItem, isLoading } = useCartStore();
  const items = selectCartItems(useCartStore.getState());
  
  const subtotal = cart?.cost.subtotalAmount || { amount: '0', currencyCode: 'USD' };
  const totalQuantity = cart?.totalQuantity || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />
          
          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="text-lg font-semibold">
                  Your Cart ({totalQuantity})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-neutral-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-16 w-16 text-neutral-300" />
                  <h3 className="mt-4 text-lg font-medium">Your cart is empty</h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    Add items to get started
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-shopify-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-shopify-green/90"
                  >
                    Continue Shopping
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => {
                      const variant = item.merchandise;
                      const product = variant.product;
                      
                      return (
                        <motion.li
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="flex gap-4 rounded-lg border p-3"
                        >
                          {/* Product Image */}
                          <Link
                            href={`/products/${product.handle}`}
                            onClick={onClose}
                            className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100"
                          >
                            {variant.image && (
                              <Image
                                src={variant.image.url}
                                alt={variant.image.altText || product.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </Link>
                          
                          {/* Product Info */}
                          <div className="flex flex-1 flex-col">
                            <Link
                              href={`/products/${product.handle}`}
                              onClick={onClose}
                              className="line-clamp-2 text-sm font-medium hover:text-shopify-green"
                            >
                              {product.title}
                            </Link>
                            
                            {variant.title !== 'Default Title' && (
                              <p className="mt-0.5 text-xs text-neutral-500">
                                {variant.title}
                              </p>
                            )}
                            
                            <div className="mt-auto flex items-center justify-between pt-2">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateItem(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || isLoading}
                                  className="flex h-7 w-7 items-center justify-center rounded border hover:bg-neutral-50 disabled:opacity-50"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-sm">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateItem(item.id, item.quantity + 1)}
                                  disabled={isLoading}
                                  className="flex h-7 w-7 items-center justify-center rounded border hover:bg-neutral-50 disabled:opacity-50"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              
                              {/* Price */}
                              <p className="font-semibold">
                                {formatMoney(
                                  parseFloat(item.cost.totalAmount.amount) * item.quantity,
                                  item.cost.totalAmount.currencyCode
                                )}
                              </p>
                            </div>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={isLoading}
                            className="self-start text-neutral-400 hover:text-red-500 disabled:opacity-50"
                            aria-label="Remove item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>
            
            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-lg font-semibold">
                    {formatMoney(subtotal.amount, subtotal.currencyCode)}
                  </span>
                </div>
                
                {/* Checkout Button */}
                <a
                  href={cart?.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-shopify-green py-4 text-sm font-semibold text-white transition-colors hover:bg-shopify-green/90"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </a>
                
                {/* Continue Shopping */}
                <button
                  onClick={onClose}
                  className="w-full text-center text-sm text-neutral-600 hover:text-shopify-green"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
