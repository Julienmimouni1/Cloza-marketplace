import { describe, it, expect } from 'vitest';
import { validateStock } from '../logic/stock-validator';

describe('StockValidator', () => {
  it('should return valid true if requested quantity is less than or equal to stock', () => {
    const result = validateStock(5, 10);
    expect(result.isValid).toBe(true);
    expect(result.availableQuantity).toBe(10);
  });

  it('should return valid false if requested quantity exceeds stock', () => {
    const result = validateStock(15, 10);
    expect(result.isValid).toBe(false);
    expect(result.availableQuantity).toBe(10);
  });

  it('should return valid true if requested quantity equals stock', () => {
    const result = validateStock(10, 10);
    expect(result.isValid).toBe(true);
  });

  it('should handle zero stock', () => {
    const result = validateStock(1, 0);
    expect(result.isValid).toBe(false);
    expect(result.availableQuantity).toBe(0);
  });
});
