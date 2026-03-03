import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CartDrawer } from '../components/CartDrawer';
import * as useCartHook from '../hooks/useCart';

// Polyfill ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock useCart
vi.mock('../hooks/useCart', () => ({
  useCart: vi.fn(),
}));

// Mock CartItemRow to simplify testing parent
vi.mock('../components/CartItemRow', () => ({
    CartItemRow: ({ item }: any) => <div data-testid="cart-item">{item.title}</div>
}));

describe('CartDrawer', () => {
    const mockCloseDrawer = vi.fn();
    const mockTotalItems = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks();
        mockTotalItems.mockReturnValue(0);
    });

    it('should be hidden when isOpen is false', () => {
        (useCartHook.useCart as any).mockReturnValue({
            items: [],
            isOpen: false,
            closeDrawer: mockCloseDrawer,
            totalItems: mockTotalItems,
            pricing: { totalHT: 0, totalTTC: 0, totalDiscount: 0, totalVAT: 0 }
        });

        render(<CartDrawer />);
        expect(screen.queryByText('Panier')).toBeNull();
    });

    it('should be visible when isOpen is true', () => {
         (useCartHook.useCart as any).mockReturnValue({
            items: [],
            isOpen: true,
            closeDrawer: mockCloseDrawer,
            totalItems: mockTotalItems,
             pricing: { totalHT: 0, totalTTC: 0, totalDiscount: 0, totalVAT: 0 }
        });

        render(<CartDrawer />);
        expect(screen.getByText('Panier (0)')).toBeInTheDocument();
        expect(screen.getByText('Votre panier est vide.')).toBeInTheDocument();
    });

    it('should render items when cart has items', () => {
        mockTotalItems.mockReturnValue(2);
        (useCartHook.useCart as any).mockReturnValue({
            items: [
                { id: '1', title: 'Item 1', priceHT: 1000, quantity: 1, image: '' }, // 10.00
                { id: '2', title: 'Item 2', priceHT: 2000, quantity: 1, image: '' }  // 20.00
            ],
            isOpen: true,
            closeDrawer: mockCloseDrawer,
            totalItems: mockTotalItems,
            pricing: { totalHT: 3000, totalTTC: 3600, totalDiscount: 0, totalVAT: 600 }
        });

        render(<CartDrawer />);
        expect(screen.getAllByTestId('cart-item')).toHaveLength(2);
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('30.00 €')).toBeInTheDocument();
    });
});
