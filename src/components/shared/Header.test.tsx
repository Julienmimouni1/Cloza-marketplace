import { render, screen } from '@testing-library/react';
import Header from './Header';
import { describe, it, expect } from 'vitest';

describe('Header Component', () => {
  it('renders the brand name CLOZA', () => {
    render(<Header />);
    const brandElement = screen.getByText(/CLOZA/i);
    expect(brandElement).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText(/Catalog/i)).toBeInTheDocument();
    expect(screen.getByText(/New Arrivals/i)).toBeInTheDocument();
    expect(screen.getByText(/Brands/i)).toBeInTheDocument();
    expect(screen.getByText(/Deals/i)).toBeInTheDocument();
  });
});
