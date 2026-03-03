import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProductGrid } from './ProductGrid';

describe('ProductGrid', () => {
  const mockProducts = [
    {
      id: '1',
      title: 'Product 1',
      price: 10000,
      stock: 5,
      image: '/p1.jpg',
      category: 'Textile',
      slug: 'p1',
      vendorId: 'v1',
      vendor: { name: 'Vendor 1' },
    },
    {
      id: '2',
      title: 'Product 2',
      price: 20000,
      stock: 5,
      image: '/p2.jpg',
      category: 'Beauty',
      slug: 'p2',
      vendorId: 'v2',
      vendor: { name: 'Vendor 2' },
    },
  ];

  it('renders a list of product cards', () => {
    render(<ProductGrid products={mockProducts} />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('renders empty state message when no products', () => {
    render(<ProductGrid products={[]} />);

    expect(screen.getByText('No products found')).toBeInTheDocument();
  });
});