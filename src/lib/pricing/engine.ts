import { CartItem, DiscountRule, PricingResult, VendorTotal } from './types';

export const DISCOUNT_RULES: DiscountRule[] = [
  { id: 'tier-0', minQuantity: 0, discountPercentage: 0 },
  { id: 'tier-1', minQuantity: 5, discountPercentage: 10 },
  { id: 'tier-2', minQuantity: 10, discountPercentage: 15 },
];

export function calculateCartTotals(items: CartItem[], rules: DiscountRule[]): PricingResult {
  const vendorMap = new Map<string, { items: CartItem[]; quantity: number; rawHT: number }>();

  // 1. Group by Vendor and calculate raw stats
  for (const item of items) {
    const entry = vendorMap.get(item.vendorId) || { items: [], quantity: 0, rawHT: 0 };
    entry.items.push(item);
    entry.quantity += item.quantity;
    entry.rawHT += item.price * item.quantity;
    vendorMap.set(item.vendorId, entry);
  }

  const vendorTotals: VendorTotal[] = [];
  const appliedRules: DiscountRule[] = [];
  
  let globalHT = 0;
  let globalTTC = 0;
  let globalDiscount = 0;
  let globalVAT = 0;

  // 2. Process each vendor
  for (const [vendorId, data] of vendorMap.entries()) {
    // Find best applicable rule
    const applicableRules = rules.filter(r => 
      (r.vendorId === undefined || r.vendorId === vendorId) && 
      data.quantity >= r.minQuantity
    );

    // Sort by discount descending to pick best
    applicableRules.sort((a, b) => b.discountPercentage - a.discountPercentage);
    const bestRule = applicableRules[0];
    
    let discountPercent = 0;
    if (bestRule) {
      discountPercent = bestRule.discountPercentage;
      if (!appliedRules.find(r => r.id === bestRule.id)) {
        appliedRules.push(bestRule);
      }
    }

    // Calculate Vendor Financials
    // To be precise with VAT, we apply discount effectively to the line items
    let vendorHT = 0;
    let vendorVAT = 0;
    let vendorDiscount = 0;

    for (const item of data.items) {
      const itemRawHT = item.price * item.quantity;
      
      // Calculate item discount portion
      const itemDiscountAmount = Math.round(itemRawHT * (discountPercent / 100));
      const itemNetHT = itemRawHT - itemDiscountAmount;
      
      // Calculate VAT on the Net HT
      const itemVAT = Math.round(itemNetHT * (item.vatRate / 100));

      vendorHT += itemNetHT;
      vendorVAT += itemVAT;
      vendorDiscount += itemDiscountAmount;
    }
    
    // Vendor Total HT in the result usually refers to the Net HT or Gross?
    // In PricingResult, totalHT usually means "Total Hors Taxe Net".
    // But verify expectation. Test says:
    // Base HT: 5000, Disc: 500, Final HT: 4500.
    // So result.totalHT should be 4500.

    const vendorTTC = vendorHT + vendorVAT;

    vendorTotals.push({
      vendorId,
      totalHT: vendorHT,
      totalTTC: vendorTTC,
      totalDiscount: vendorDiscount,
      totalVAT: vendorVAT,
      itemCount: data.quantity
    });

    globalHT += vendorHT;
    globalTTC += vendorTTC;
    globalVAT += vendorVAT;
    globalDiscount += vendorDiscount;
  }

  return {
    totalHT: globalHT,
    totalTTC: globalTTC,
    totalDiscount: globalDiscount,
    totalVAT: globalVAT,
    vendorTotals,
    appliedRules
  };
}