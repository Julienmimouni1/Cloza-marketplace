import { PricingResult, DiscountRule } from '@/lib/pricing/types';

export interface CartItem {
  id: string; // This might be variantId in the store, but let's keep it generic
  variantId: string;
  productId: string;
  vendorId: string;
  title: string;
  priceHT: number; // In cents
  vatRate: number; // Percentage
  quantity: number;
  stock: number;
  image: string;
}

export interface CartState {
  items: CartItem[];
  pricing: PricingResult;
  discountRules: DiscountRule[];
  isOpen: boolean;
  isSynced: boolean;
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  setIsSynced: (val: boolean) => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  setDiscountRules: (rules: DiscountRule[]) => void;
  setItems: (items: CartItem[]) => void;
  clearCart: () => void;
  totalItems: () => number;
  openDrawer: () => void;
  closeDrawer: () => void;
}
