import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardPage from './page';

// Mock dependencies
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Mock the server action
vi.mock('@/features/dashboard/actions/get-dashboard-data', () => ({
  getDashboardData: vi.fn(),
}));

// Mock Lucide icons to avoid rendering issues if any
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as any,
  };
});

describe('DashboardPage', () => {
  it('renders dashboard for authenticated user', async () => {
    // Setup mock session
    const { auth } = await import('@/lib/auth');
    (auth as any).mockResolvedValue({
      user: {
        id: 'user-123',
        name: 'Sophie',
        role: 'RETAILER',
      },
    });

    // Setup mock dashboard data
    const { getDashboardData } = await import('@/features/dashboard/actions/get-dashboard-data');
    (getDashboardData as any).mockResolvedValue({
        user: { name: 'Sophie', isKybPending: false },
        financials: {
            creditLimit: 5000,
            creditUsed: 1240,
            creditAvailable: 3760,
            savedWithDeals: 450,
            nextPaymentDue: "Nov 20, 2026",
        },
        activeOrder: {
            id: "CLZ-8821",
            status: "SHIPPED",
            eta: "Oct 24, 2026",
            items: 12,
            total: "€1,240.00",
            brand: "Lumière Paris",
            progress: 75,
            steps: []
        },
        recentOrders: [
            { id: "CLZ-8821", brand: "Lumière Paris", date: "Oct 20", total: "€1,240", status: "SHIPPED", img: "bg-zinc-200" }
        ]
    });

    // Call the async component
    const jsx = await DashboardPage();
    render(jsx);

    // Verify "Mission Control" elements
    expect(screen.getByText(/Bon retour,/i)).toBeInTheDocument();
    expect(screen.getByText(/Sophie/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Shipment/i)).toBeInTheDocument();
    expect(screen.getByText(/BNPL BALANCE/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Orders/i)).toBeInTheDocument();
    
    // Check for specific mock data to ensure it's loaded
    expect(screen.getAllByText(/Lumière Paris/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/€1,240/i)[0]).toBeInTheDocument();
  });

  it('redirects unauthenticated user', async () => {
    // Setup null session
    const { auth } = await import('@/lib/auth');
    (auth as any).mockResolvedValue(null);
    const { redirect } = await import('next/navigation');

    try {
      await DashboardPage();
    } catch (e) {
      // redirect might throw, or we just check if it was called
    }

    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('shows KYB warning for pending verification', async () => {
    const { auth } = await import('@/lib/auth');
    (auth as any).mockResolvedValue({
      user: {
        id: 'user-123',
        name: 'New Retailer',
        role: 'RETAILER',
      },
    });

    const { getDashboardData } = await import('@/features/dashboard/actions/get-dashboard-data');
    (getDashboardData as any).mockResolvedValue({
        user: { name: 'New Retailer', isKybPending: true },
        financials: { creditLimit: 0, creditAvailable: 0 },
        activeOrder: null,
        recentOrders: []
    });

    const jsx = await DashboardPage();
    render(jsx);

    expect(screen.getByText(/Action Required: Complete your Business Verification/i)).toBeInTheDocument();
  });
});
