import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    title: 'Test Product',
    price: 10000, // 100.00
    stock: 10,
    image: '/test.jpg',
    category: 'Textile',
    slug: 'test-product',
    vendorId: 'v1',
    vendor: {
      name: 'Test Vendor',
    },
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('100.00 € HT')).toBeInTheDocument();
    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test Product');
  });
});