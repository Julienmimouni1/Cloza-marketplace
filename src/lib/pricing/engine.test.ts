import { describe, it, expect } from 'vitest';
import { calculateCartTotals, DISCOUNT_RULES } from './engine';
import { CartItem, DiscountRule } from './types';

describe('Pricing Engine', () => {
  it('should export DISCOUNT_RULES with valid configuration', () => {
    expect(DISCOUNT_RULES).toBeDefined();
    expect(Array.isArray(DISCOUNT_RULES)).toBe(true);
    // Ensure we have at least base rules
    expect(DISCOUNT_RULES.some(r => r.minQuantity === 0)).toBe(true);
    expect(DISCOUNT_RULES.some(r => r.minQuantity === 5)).toBe(true);
    expect(DISCOUNT_RULES.some(r => r.minQuantity === 10)).toBe(true);
  });

  const rules: DiscountRule[] = [
    { id: 'rule1', vendorId: 'v1', minQuantity: 5, discountPercentage: 10 },
    { id: 'rule2', vendorId: 'v2', minQuantity: 10, discountPercentage: 20 },
    // Global rule example (if supported by logic, though current logic filters by vendorId match or undefined)
    { id: 'rule3', minQuantity: 20, discountPercentage: 5 } 
  ];

  it('should return zero totals for empty cart', () => {
    const result = calculateCartTotals([], rules);
    expect(result.totalHT).toBe(0);
    expect(result.totalTTC).toBe(0);
    expect(result.totalDiscount).toBe(0);
  });

  it('should calculate correct totals without discount (quantity < threshold)', () => {
    const items: CartItem[] = [
      { id: '1', variantId: 'var1', productId: 'p1', vendorId: 'v1', price: 1000, quantity: 4, vatRate: 20 }
    ];
    // 4 * 1000 = 4000 HT
    // VAT = 800
    // TTC = 4800
    
    const result = calculateCartTotals(items, rules);
    expect(result.totalHT).toBe(4000);
    expect(result.totalDiscount).toBe(0);
    expect(result.totalVAT).toBe(800);
    expect(result.totalTTC).toBe(4800);
    expect(result.appliedRules).toHaveLength(0);
  });

  it('should apply discount when quantity threshold is met (v1, 5+ items)', () => {
    const items: CartItem[] = [
      { id: '1', variantId: 'var1', productId: 'p1', vendorId: 'v1', price: 1000, quantity: 5, vatRate: 20 }
    ];
    // Base HT: 5000
    // Discount: 10% of 5000 = 500
    // Final HT: 4500
    // VAT: 20% of 4500 = 900
    // TTC: 5400

    const result = calculateCartTotals(items, rules);
    expect(result.totalHT).toBe(4500);
    expect(result.totalDiscount).toBe(500);
    expect(result.totalVAT).toBe(900);
    expect(result.totalTTC).toBe(5400);
    expect(result.appliedRules).toHaveLength(1);
    expect(result.appliedRules[0].id).toBe('rule1');
  });

  it('should prioritize higher discount when multiple rules apply', () => {
    const multiTierRules: DiscountRule[] = [
      { id: 'tier1', vendorId: 'v1', minQuantity: 5, discountPercentage: 10 },
      { id: 'tier2', vendorId: 'v1', minQuantity: 10, discountPercentage: 20 },
    ];

    const items: CartItem[] = [
      { id: '1', variantId: 'var1', productId: 'p1', vendorId: 'v1', price: 1000, quantity: 12, vatRate: 20 }
    ];
    // Quantity 12 > 10, so Tier 2 (20%) should apply.
    // Base: 12000
    // Disc: 2400 (20%)
    // HT: 9600
    // VAT: 1920
    // TTC: 11520

    const result = calculateCartTotals(items, multiTierRules);
    expect(result.totalHT).toBe(9600);
    expect(result.totalDiscount).toBe(2400);
    expect(result.appliedRules).toHaveLength(1);
    expect(result.appliedRules[0].id).toBe('tier2');
  });

  it('should handle multi-vendor scenarios with mixed VAT rates', () => {
    const items: CartItem[] = [
      { id: '1', variantId: 'var1', productId: 'p1', vendorId: 'v1', price: 1000, quantity: 5, vatRate: 20 }, // 5 items, -10% (rule1)
      { id: '2', variantId: 'var2', productId: 'p2', vendorId: 'v2', price: 2000, quantity: 2, vatRate: 5.5 }  // 2 items, no discount
    ];

    // Vendor 1 (20% VAT, 10% Disc):
    // Base: 5000, Disc: 500, HT: 4500, VAT: 900, TTC: 5400

    // Vendor 2 (5.5% VAT, 0% Disc):
    // Base: 4000, Disc: 0, HT: 4000, VAT: 220 (4000 * 0.055), TTC: 4220

    // Global:
    // HT: 8500
    // Disc: 500
    // VAT: 1120
    // TTC: 9620

    const result = calculateCartTotals(items, rules);
    
    expect(result.totalHT).toBe(8500);
    expect(result.totalDiscount).toBe(500);
    expect(result.totalVAT).toBe(1120);
    expect(result.totalTTC).toBe(9620);

    expect(result.vendorTotals).toHaveLength(2);
    const v2 = result.vendorTotals.find(v => v.vendorId === 'v2');
    expect(v2?.totalVAT).toBe(220);
  });
});