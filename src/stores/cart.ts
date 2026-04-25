import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartLine, MoneyV2 } from '@/types/shopify';
import { createCart, getCart, addToCart, updateCart, removeFromCart } from '@/lib/shopify';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initCart: () => Promise<void>;
  addItem: (merchandiseId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
  
  // Computed
  getTotalQuantity: () => number;
  getSubtotal: () => MoneyV2;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,

      initCart: async () => {
        const { cart: storedCart } = useCartStore.getState();
        
        // If we have a stored cart ID, try to fetch it
        if (storedCart?.id) {
          try {
            const freshCart = await getCart(storedCart.id);
            if (freshCart) {
              set({ cart: freshCart, error: null });
              return;
            }
          } catch (error) {
            console.error('Failed to fetch stored cart:', error);
          }
        }
        
        // Create a new cart
        try {
          set({ isLoading: true, error: null });
          const newCart = await createCart();
          set({ cart: newCart, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to create cart' 
          });
        }
      },

      addItem: async (merchandiseId: string, quantity: number) => {
        const { cart } = get();
        if (!cart) {
          await get().initCart();
        }
        
        const currentCart = useCartStore.getState().cart;
        if (!currentCart) return;

        try {
          set({ isLoading: true, error: null });
          const updatedCart = await addToCart(currentCart.id, [
            { merchandiseId, quantity }
          ]);
          set({ cart: updatedCart, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to add item' 
          });
        }
      },

      updateItem: async (lineId: string, quantity: number) => {
        const { cart } = get();
        if (!cart) return;

        try {
          set({ isLoading: true, error: null });
          const updatedCart = await updateCart(cart.id, [{ id: lineId, quantity }]);
          set({ cart: updatedCart, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to update item' 
          });
        }
      },

      removeItem: async (lineId: string) => {
        const { cart } = get();
        if (!cart) return;

        try {
          set({ isLoading: true, error: null });
          const updatedCart = await removeFromCart(cart.id, [lineId]);
          set({ cart: updatedCart, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to remove item' 
          });
        }
      },

      clearCart: () => {
        set({ cart: null });
      },

      getTotalQuantity: () => {
        const { cart } = get();
        return cart?.totalQuantity || 0;
      },

      getSubtotal: () => {
        const { cart } = get();
        return cart?.cost.subtotalAmount || { amount: '0', currencyCode: 'USD' };
      },
    }),
    {
      name: 'shopify-cart',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

// Selectors
export const selectCartItems = (state: CartState): CartLine[] => {
  return state.cart?.lines.edges.map((e) => e.node) || [];
};

export const selectCartItemCount = (state: CartState): number => {
  return state.cart?.totalQuantity || 0;
};

export const selectCartTotal = (state: CartState): MoneyV2 => {
  return state.cart?.cost.totalAmount || { amount: '0', currencyCode: 'USD' };
};
