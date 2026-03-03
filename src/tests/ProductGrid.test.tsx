import { render, screen } from '@testing-library/react';
import { ProductGrid } from '../features/catalog/components/ProductGrid';
import { describe, it, expect } from 'vitest';

const mockProducts = [
  {
    id: '1',
    title: 'Test Product 1',
    price: 10000,
    stock: 5,
    image: 'https://example.com/img1.jpg',
    category: 'Textile',
    slug: 'p1',
    vendorId: 'v1',
    vendor: { name: 'Vendor A' }
  },
  {
    id: '2',
    title: 'Test Product 2',
    price: 20000,
    stock: 5,
    image: 'https://example.com/img2.jpg',
    category: 'Beauty',
    slug: 'p2',
    vendorId: 'v2',
    vendor: { name: 'Vendor B' }
  }
];

describe('ProductGrid', () => {
  it('renders a grid of products', () => {
    render(<ProductGrid products={mockProducts} />);
    
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('Vendor A')).toBeInTheDocument();
  });

  it('renders empty state when no products', () => {
    render(<ProductGrid products={[]} />);
    expect(screen.getByText(/No products found/i)).toBeInTheDocument();
  });
});