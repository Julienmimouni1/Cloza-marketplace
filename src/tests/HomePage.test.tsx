import { render, screen } from '@testing-library/react';
import HomePage from '../app/[locale]/page';
import { describe, it, expect } from 'vitest';

describe('HomePage', () => {
  it('renders the hero heading', () => {
    render(<HomePage />);
    expect(screen.getByText(/Smart Luxury/i)).toBeInTheDocument();
    expect(screen.getByText(/B2B Marketplace/i)).toBeInTheDocument();
  });

  it('renders call to action buttons', () => {
    render(<HomePage />);
    expect(screen.getByText(/Explore Collections/i)).toBeInTheDocument();
    expect(screen.getByText(/Apply for Access/i)).toBeInTheDocument();
  });

  it('renders trust bar brands', () => {
    render(<HomePage />);
    expect(screen.getAllByText(/VOGUE/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/ELLE/i)[0]).toBeInTheDocument();
  });
});
