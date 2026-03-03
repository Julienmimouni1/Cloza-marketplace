import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState, CartItem } from '../types';
import { CART_STORAGE_KEY } from '../constants';
import { calculateCartTotals, DISCOUNT_RULES } from '@/lib/pricing/engine';
import { CartItem as PricingCartItem } from '@/lib/pricing/types';
import { validateStockAction, updateCartItemAction, removeFromCartAction, syncCart } from '../actions';
import { toast } from 'sonner';

// Helper to check auth status within the hook logic if needed, 
// though usually we prefer passing it or using a component side-effect.
// For simplicity and immediate fix, we'll check session in actions.

// Helper to map Feature CartItem to Pricing Engine CartItem
const mapToPricingItem = (item: CartItem): PricingCartItem => ({
  id: item.id,
  variantId: item.variantId,
  productId: item.productId,
  vendorId: item.vendorId,
  price: item.priceHT,
  quantity: item.quantity,
  vatRate: item.vatRate,
});

const initialPricing = {
  totalHT: 0,
  totalTTC: 0,
  totalDiscount: 0,
  totalVAT: 0,
  vendorTotals: [],
  appliedRules: [],
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      pricing: initialPricing,
      discountRules: DISCOUNT_RULES,
      isOpen: false,
      isSynced: false,
      hasHydrated: false,

      setHasHydrated: (val) => set({ hasHydrated: val }),
      setIsSynced: (val) => set({ isSynced: val }),

      setItems: (items) => {
        const { discountRules } = get();
        const currentRules = discountRules.length > 0 ? discountRules : DISCOUNT_RULES;
        const pricing = calculateCartTotals(items.map(mapToPricingItem), currentRules);
        set({ items, pricing });
      },

      setDiscountRules: (rules) => {
        set({ discountRules: rules });
        // Recalculate with new rules
        const { items } = get();
        const pricing = calculateCartTotals(items.map(mapToPricingItem), rules);
        set({ pricing });
      },

      addItem: async (newItem) => {
        const { items, discountRules } = get();
        const existingItem = items.find((item) => item.id === newItem.id);

        let newItems;
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const targetQuantity = currentQuantity + 1;

        if (existingItem) {
          if (existingItem.quantity >= existingItem.stock) {
            toast.error(`Only ${existingItem.stock} items remaining in stock`);
            return;
          }
          newItems = items.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          if (newItem.stock < 1) {
            toast.error("Item is out of stock");
            return;
          }
          newItems = [...items, { ...newItem, quantity: 1 }];
        }

        const currentRules = discountRules.length > 0 ? discountRules : DISCOUNT_RULES;
        const pricing = calculateCartTotals(newItems.map(mapToPricingItem), currentRules);
        set({ items: newItems, pricing, isOpen: true });

        // Server validation & Sync
        const result = await validateStockAction(newItem.productId, targetQuantity);
        
        if (result.success) {
            // Push to DB if authenticated
            await syncCart([{ ...newItem, quantity: 1 } as CartItem]);
            
            const { items: currentItems } = get();
            const updatedItems = currentItems.map(item => 
                item.id === newItem.id ? { ...item, stock: result.data.availableQuantity } : item
            );
            set({ items: updatedItems });
        } else if (result.error.code === 'INSUFFICIENT_STOCK') {
           const available = result.error.data.availableQuantity;
           toast.error(result.error.message);
           
           const { items: currentItems } = get();
           let correctedItems;
           if (available < 1) {
               correctedItems = currentItems.filter(item => item.id !== newItem.id);
           } else {
               correctedItems = currentItems.map(item => 
                 item.id === newItem.id ? { ...item, quantity: available, stock: available } : item
               );
               // Sync correction to DB
               await updateCartItemAction(newItem.productId, available);
           }
           
           const correctedPricing = calculateCartTotals(correctedItems.map(mapToPricingItem), currentRules);
           set({ items: correctedItems, pricing: correctedPricing });
        }
      },

      removeItem: async (id) => {
        const { items, discountRules } = get();
        const itemToRemove = items.find(i => i.id === id);
        const newItems = items.filter((item) => item.id !== id);
        const currentRules = discountRules.length > 0 ? discountRules : DISCOUNT_RULES;
        const pricing = calculateCartTotals(newItems.map(mapToPricingItem), currentRules);
        set({ items: newItems, pricing });

        if (itemToRemove) {
          await removeFromCartAction(itemToRemove.productId);
        }
      },

      updateQuantity: async (id, quantity) => {
        if (quantity < 1) return;
        const { items, discountRules } = get();
        const item = items.find(i => i.id === id);
        
        if (!item) return;

        const requestedQuantity = quantity;
        const optimisticQuantity = quantity > item.stock ? item.stock : quantity;
        
        const newItems = items.map((i) =>
          i.id === id ? { ...i, quantity: optimisticQuantity } : i
        );
        const currentRules = discountRules.length > 0 ? discountRules : DISCOUNT_RULES;
        const pricing = calculateCartTotals(newItems.map(mapToPricingItem), currentRules);
        set({ items: newItems, pricing });

        // Server validation & DB Sync
        const result = await validateStockAction(item.productId, requestedQuantity);

        if (result.success) {
             await updateCartItemAction(item.productId, optimisticQuantity);
             const { items: currentItems } = get();
             const updatedItems = currentItems.map(i => 
                i.id === id ? { ...i, stock: result.data.availableQuantity } : i
            );
            set({ items: updatedItems });
        } else if (result.error.code === 'INSUFFICIENT_STOCK') {
          const available = result.error.data.availableQuantity;
          toast.error(result.error.message);

          const { items: currentItems } = get();
          const correctedItems = currentItems.map(i => 
            i.id === id ? { ...i, quantity: available, stock: available } : i
          );
          await updateCartItemAction(item.productId, available);
          const correctedPricing = calculateCartTotals(correctedItems.map(mapToPricingItem), currentRules);
          set({ items: correctedItems, pricing: correctedPricing });
        }
      },

      clearCart: () => {
        set({ items: [], pricing: initialPricing });
      },

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
    }),
    {
      name: CART_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
         // Re-calculate pricing on hydration to ensure consistency if rules changed
         if (state && state.items.length > 0) {
             const rules = state.discountRules.length > 0 ? state.discountRules : DISCOUNT_RULES;
             state.pricing = calculateCartTotals(state.items.map(mapToPricingItem), rules);
         }
      }
    }
  )
);