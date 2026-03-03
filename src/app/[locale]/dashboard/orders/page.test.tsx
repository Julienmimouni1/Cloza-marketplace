import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OrdersPage from './page';

// Mock dependencies
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Mock Lucide icons
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as any,
  };
});

describe('OrdersPage', () => {
  it('renders order history for authenticated user', async () => {
    // Setup mock session
    const { auth } = await import('@/lib/auth');
    (auth as any).mockResolvedValue({
      user: {
        name: 'Sophie',
        role: 'RETAILER',
      },
    });

    const jsx = await OrdersPage();
    render(jsx);

    // Verify Title
    expect(screen.getByRole('heading', { name: /Order History/i })).toBeInTheDocument();
    
    // Verify Mock Data in Table
    expect(screen.getByText('CLZ-8821')).toBeInTheDocument();
    expect(screen.getAllByText('Lumière Paris')[0]).toBeInTheDocument();
    expect(screen.getByText('SHIPPED')).toBeInTheDocument();
  });

  it('redirects unauthenticated user', async () => {
    const { auth } = await import('@/lib/auth');
    (auth as any).mockResolvedValue(null);
    const { redirect } = await import('next/navigation');

    try {
      await OrdersPage();
    } catch (e) {
      // ignore redirect throw
    }

    expect(redirect).toHaveBeenCalledWith('/login');
  });
});
