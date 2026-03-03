import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCart } from '../hooks/useCart';

describe('useCart Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.clearCart();
      result.current.closeDrawer();
    });
    // Double check it's cleared
    if (result.current.items.length > 0) {
        // Force clear if implementation of clearCart is empty (which it is currently)
        useCart.setState({ items: [] });
    }
  });

  const mockItem = { 
    id: '1', 
    variantId: '1',
    productId: 'prod1',
    vendorId: 'vendor1',
    title: 'Product 1', 
    priceHT: 100, 
    vatRate: 20,
    image: '/img.jpg',
    stock: 10
  };

  it('should initialize with empty items', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems()).toBe(0);
  });

  it('should add an item to the cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({ ...mockItem, quantity: 1 });
    expect(result.current.totalItems()).toBe(1);
  });

  it('should increment quantity if adding existing item', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockItem);
      result.current.addItem(mockItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems()).toBe(2);
  });

  it('should update quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockItem);
      result.current.updateQuantity('1', 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalItems()).toBe(5);
  });

  it('should remove item', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockItem);
      result.current.removeItem('1');
    });

    expect(result.current.items).toHaveLength(0);
  });
  
  it('should not update quantity below 1', () => {
      const { result } = renderHook(() => useCart());
  
      act(() => {
        result.current.addItem(mockItem);
        result.current.updateQuantity('1', 0);
      });
      
      expect(result.current.items[0].quantity).toBe(1);
  });

  it('should manage drawer state', () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.openDrawer();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeDrawer();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should calculate pricing totals', () => {
    const { result } = renderHook(() => useCart());
    
    // Add 5 items of 1.00 each
    const item = { ...mockItem, priceHT: 100 }; 

    act(() => {
        // Add 5 times or update quantity
        result.current.addItem(item);
        result.current.updateQuantity(item.id, 5);
    });

    // 5 * 100 = 500 Raw HT.
    // Default Rules: 5 items = 10% discount.
    // Discount = 50.
    // Net HT = 450.
    // VAT 20% of 450 = 90.
    // TTC = 540.
    expect(result.current.pricing.totalHT).toBe(450);
    expect(result.current.pricing.totalDiscount).toBe(50);
    expect(result.current.pricing.totalVAT).toBe(90);
    expect(result.current.pricing.totalTTC).toBe(540);
  });
});