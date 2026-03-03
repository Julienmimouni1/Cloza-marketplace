import { render, screen } from '@testing-library/react';
import { HowItWorks } from '../components/marketing/HowItWorks';
import { describe, it, expect } from 'vitest';

describe('HowItWorks', () => {
  it('renders the section heading', () => {
    render(<HowItWorks />);
    expect(screen.getByRole('heading', { level: 2, name: /How it Works/i })).toBeInTheDocument();
  });

  it('renders the 3 steps with titles', () => {
    render(<HowItWorks />);
    expect(screen.getByText(/Discover/i)).toBeInTheDocument();
    expect(screen.getByText(/Order/i)).toBeInTheDocument();
    expect(screen.getByText(/Sell/i)).toBeInTheDocument();
  });

  it('renders step descriptions', () => {
    render(<HowItWorks />);
    expect(screen.getByText(/Curated brands & high margins/i)).toBeInTheDocument();
    expect(screen.getByText(/Low minimums & mixed carts/i)).toBeInTheDocument();
    expect(screen.getByText(/Net-60 payment terms/i)).toBeInTheDocument();
  });
});
