"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
}

interface FilterSidebarProps {
  categories: Category[];
  className?: string;
}

export function FilterSidebar({ categories, className }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (activeCategory === categoryId) {
      params.delete('category');
    } else {
      params.set('category', categoryId);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="mb-4 font-serif text-lg font-medium">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                "block w-full text-left text-sm transition-colors hover:text-cloza-gold",
                activeCategory === category.id
                  ? "font-medium text-black"
                  : "text-muted-foreground"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
