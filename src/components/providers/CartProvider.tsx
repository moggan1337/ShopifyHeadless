'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/stores/cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const initCart = useCartStore((state) => state.initCart);

  useEffect(() => {
    const init = async () => {
      try {
        await initCart();
      } catch (error) {
        console.error('Failed to initialize cart:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    init();
  }, [initCart]);

  // Don't render children until cart is initialized to prevent flash
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-shopify-green border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
