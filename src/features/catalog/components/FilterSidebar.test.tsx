import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterSidebar } from './FilterSidebar';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('FilterSidebar', () => {
  const categories = [{ id: 'textile', name: 'Textile' }, { id: 'beauty', name: 'Beauty' }];

  it('renders passed categories', () => {
    render(<FilterSidebar categories={categories} />);
    expect(screen.getByText('Textile')).toBeInTheDocument();
    expect(screen.getByText('Beauty')).toBeInTheDocument();
  });
});
