export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  vendorId: string;
  price: number; // Price in cents
  quantity: number;
  vatRate: number; // Percentage (e.g., 20 for 20%)
}

export interface DiscountRule {
  id: string;
  vendorId?: string; // If null, applies globally? Or strictly per vendor? Story implies "set of quantity-based discount rules". Usually per vendor in B2B.
  minQuantity: number;
  discountPercentage: number; // e.g., 10 for 10%
}

export interface VendorTotal {
  vendorId: string;
  totalHT: number;
  totalTTC: number;
  totalDiscount: number;
  totalVAT: number;
  itemCount: number;
}

export interface PricingResult {
  totalHT: number;
  totalTTC: number;
  totalDiscount: number;
  totalVAT: number;
  vendorTotals: VendorTotal[];
  appliedRules: DiscountRule[];
}
