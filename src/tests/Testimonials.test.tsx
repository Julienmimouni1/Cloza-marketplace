import { render, screen } from '@testing-library/react';
import { Testimonials } from '../components/marketing/Testimonials';
import { describe, it, expect } from 'vitest';

describe('Testimonials', () => {
  it('renders the section heading', () => {
    render(<Testimonials />);
    expect(screen.getByText(/Trusted by Retailers/i)).toBeInTheDocument();
  });

  it('renders at least 3 testimonials', () => {
    render(<Testimonials />);
    const quotes = screen.getAllByRole('blockquote');
    expect(quotes.length).toBeGreaterThanOrEqual(3);
  });

  it('displays retailer names and boutiques', () => {
    render(<Testimonials />);
    expect(screen.getByText(/Sophie/i)).toBeInTheDocument();
    expect(screen.getByText(/Boutique L'Aura/i)).toBeInTheDocument();
  });
});
